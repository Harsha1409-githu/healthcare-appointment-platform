import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Upload,
  Trash2,
  Search,
  Download,
  Loader2,
  ShieldCheck,
  X,
  Eye,
  FileDown,
  MoreVertical,
  UserRound,
  ChevronDown,
  Check,
  Image,
  Stethoscope,
  CalendarDays,
} from "lucide-react";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";

import PageHeader from "../components/PageHeader";
import api from "../api/axios";
import usePullToRefresh from "../hooks/usePullToRefresh";

const FILTERS = [
  { value: "ALL", label: "All" },
  { value: "LAB_REPORT", label: "Reports" },
  { value: "PRESCRIPTION", label: "Rx" },
  { value: "XRAY", label: "X-Ray" },
  { value: "MRI", label: "MRI" },
  { value: "DISCHARGE_SUMMARY", label: "Summary" },
];

export default function MedicalRecords() {
  const patient =
    JSON.parse(localStorage.getItem("patientUser") || "null") ||
    JSON.parse(localStorage.getItem("user") || "null");

  const savedProfile = JSON.parse(
    localStorage.getItem("selectedProfile") || "null"
  );

  const [profiles, setProfiles] = useState([]);
  const [activeProfile, setActiveProfile] = useState(savedProfile);
  const [showProfilePicker, setShowProfilePicker] = useState(false);

  const [records, setRecords] = useState([]);
  const [previewRecord, setPreviewRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [openMenuId, setOpenMenuId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    recordType: "LAB_REPORT",
    fileUrl: "",
    fileName: "",
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRecords();
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      if (!patient?.id) return;

      const res = await api.get(`/family-member/patient/${patient.id}`);

      const selfProfile = {
        id: patient.id,
        fullName: patient.fullName || "Me",
        relation: "SELF",
        gender: patient.gender,
        age: patient.age,
        mobile: patient.mobile,
        profileImage: patient.profileImage,
        isSelf: true,
      };

      const allProfiles = [selfProfile, ...(res.data || [])];
      setProfiles(allProfiles);

      if (!activeProfile?.id) {
        setActiveProfile(selfProfile);
        localStorage.setItem("selectedProfile", JSON.stringify(selfProfile));
      }
    } catch (error) {
      console.error("Profile load error:", error);
    }
  };

  const fetchRecords = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);

      const res = await api.get("/medical-record/my");
      setRecords(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load records");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const { pullDistance, refreshing, visible } = usePullToRefresh(async () => {
    await fetchRecords(false);
    toast.success("Records refreshed");
  });

  const switchProfile = (profile) => {
    localStorage.setItem("selectedProfile", JSON.stringify(profile));
    setActiveProfile(profile);
    setShowProfilePicker(false);
    toast.success(`Switched to ${profile.fullName}`);
    window.dispatchEvent(new Event("patientProfileUpdated"));
  };

  const profileRecords = useMemo(() => {
    return records.filter((item) => {
      if (!activeProfile) return true;

      if (activeProfile.isSelf) {
        return !item.familyMember;
      }

      return item.familyMember?.id === activeProfile.id;
    });
  }, [records, activeProfile]);

  const filtered = profileRecords.filter((item) => {
    const matchesSearch = `${item.title} ${item.recordType} ${
      item.fileName || ""
    }`
      .toLowerCase()
      .includes(search.toLowerCase().trim());

    const matchesType = typeFilter === "ALL" || item.recordType === typeFilter;

    return matchesSearch && matchesType;
  });

  const groupedRecords = useMemo(() => {
    return filtered.reduce((groups, record) => {
      const year = record.uploadedAt
        ? new Date(record.uploadedAt).getFullYear()
        : "Recent";

      if (!groups[year]) groups[year] = [];
      groups[year].push(record);

      return groups;
    }, {});
  }, [filtered]);

  const stats = useMemo(
    () => ({
      total: profileRecords.length,
      reports: profileRecords.filter((r) => r.recordType === "LAB_REPORT")
        .length,
      prescriptions: profileRecords.filter(
        (r) => r.recordType === "PRESCRIPTION"
      ).length,
      scans: profileRecords.filter((r) => ["XRAY", "MRI"].includes(r.recordType))
        .length,
    }),
    [profileRecords]
  );

  const handleFileSelect = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);

      const res = await api.post("/medical-record/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm((prev) => ({
        ...prev,
        fileUrl: res.data.fileUrl,
        fileName: res.data.fileName,
        title: prev.title || res.data.fileName?.replace(/\.[^/.]+$/, ""),
      }));

      toast.success("File uploaded");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "File upload failed");
    } finally {
      setUploading(false);
    }
  };

  const createRecord = async () => {
    if (!form.title || !form.recordType || !form.fileUrl) {
      toast.error("Please choose a file and enter record details");
      return;
    }

    try {
      setSaving(true);

      await api.post("/medical-record", {
        ...form,
        familyMemberId: activeProfile?.isSelf ? undefined : activeProfile?.id,
      });

      toast.success("Record saved");

      setForm({
        title: "",
        recordType: "LAB_REPORT",
        fileUrl: "",
        fileName: "",
      });

      fetchRecords(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save record");
    } finally {
      setSaving(false);
    }
  };

  const deleteRecord = async (id) => {
    if (!window.confirm("Delete record?")) return;

    try {
      await api.delete(`/medical-record/${id}`);
      toast.success("Record deleted");
      setOpenMenuId(null);
      fetchRecords(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete record");
    }
  };

  const clearUpload = () => {
    setForm({
      title: "",
      recordType: "LAB_REPORT",
      fileUrl: "",
      fileName: "",
    });
  };

  const isImage = (url = "") => url.match(/\.(jpg|jpeg|png|webp|gif)$/i);

  const downloadAsPdf = async (record) => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");

      pdf.setFontSize(18);
      pdf.text(record.title || "Medical Record", 15, 20);

      pdf.setFontSize(11);
      pdf.text(
        `Type: ${record.recordType?.replaceAll("_", " ") || "Record"}`,
        15,
        30
      );

      pdf.text(
        `Uploaded: ${
          record.uploadedAt
            ? new Date(record.uploadedAt).toLocaleString()
            : "Uploaded"
        }`,
        15,
        38
      );

      if (isImage(record.fileUrl)) {
        const img = await loadImage(record.fileUrl);
        pdf.addImage(img, "PNG", 15, 50, 180, 160);
      } else {
        pdf.text("Original file link:", 15, 55);
        pdf.text(record.fileUrl, 15, 63, { maxWidth: 180 });
      }

      pdf.save(`${record.title || "medical-record"}.pdf`);
    } catch (error) {
      console.error(error);
      toast.error("PDF download failed. Please open the file directly.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f8fb] pb-28">
      {visible && (
        <div
          className="fixed top-0 left-0 right-0 z-[100] flex justify-center transition-all duration-300"
          style={{ transform: `translateY(${pullDistance}px)` }}
        >
          <div className="mt-3 bg-white border border-slate-200 shadow-lg rounded-full px-4 py-2 flex items-center gap-2">
            <div
              className={`w-4 h-4 border-2 border-cyan-600 border-t-transparent rounded-full ${
                refreshing ? "animate-spin" : ""
              }`}
            />

            <span className="text-xs font-black text-cyan-700">
              {refreshing
                ? "Refreshing..."
                : pullDistance > 70
                ? "Release to refresh"
                : "Pull to refresh"}
            </span>
          </div>
        </div>
      )}

      <PageHeader
        title="Medical Records"
        subtitle={`${filtered.length} records found`}
      />

      <div className="sticky top-0 z-30 bg-[#f4f8fb]/95 backdrop-blur-xl">
        <div className="max-w-md mx-auto px-4 mt-1 mb-3 pt-2">
          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => setShowProfilePicker(true)}
              className="flex items-center gap-1 text-slate-900 font-bold"
            >
              {activeProfile?.profileImage ? (
                <img
                  src={activeProfile.profileImage}
                  alt={activeProfile.fullName}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <UserRound size={15} className="text-cyan-600" />
              )}

              <span className="truncate max-w-[150px]">
                {activeProfile?.fullName || patient?.fullName || "Patient"}
              </span>

              <ChevronDown size={13} className="text-slate-400" />
            </button>

            <span className="text-xs font-black text-cyan-700">
              Health Vault
            </span>
          </div>

          <div className="border-b border-slate-200 mt-2" />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4">
        <section className="bg-slate-950 rounded-3xl p-4 text-white">
          <p className="text-xs text-cyan-200 font-black">HEALTH VAULT</p>

          <h1 className="text-2xl font-black mt-1">
            {activeProfile?.fullName || patient?.fullName || "Patient"}
          </h1>

          <div className="grid grid-cols-4 gap-2 mt-4">
            <VaultStat label="Records" value={stats.total} />
            <VaultStat label="Reports" value={stats.reports} />
            <VaultStat label="Rx" value={stats.prescriptions} />
            <VaultStat label="Scans" value={stats.scans} />
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <h2 className="text-lg font-black text-slate-950 mb-3">
            Upload Record
          </h2>

          <label className="block border-2 border-dashed border-cyan-200 bg-cyan-50 rounded-3xl p-4 text-center active:scale-95 transition">
            {uploading ? (
              <Loader2
                className="mx-auto text-cyan-600 mb-2 animate-spin"
                size={28}
              />
            ) : (
              <Upload className="mx-auto text-cyan-600 mb-2" size={28} />
            )}

            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={(e) => handleFileSelect(e.target.files?.[0])}
              className="hidden"
            />

            <span className="inline-flex bg-cyan-600 text-white px-4 py-2 rounded-2xl font-black text-sm">
              {uploading ? "Uploading..." : "Choose File"}
            </span>

            <p className="text-xs text-slate-500 mt-2">
              PDF, JPG, PNG, WEBP supported
            </p>
          </label>

          {form.fileUrl && (
            <div className="mt-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-black text-emerald-700 text-sm">
                  File uploaded
                </p>

                <p className="text-xs text-emerald-700 truncate">
                  {form.fileName}
                </p>
              </div>

              <button type="button" onClick={clearUpload}>
                <X size={17} className="text-emerald-700" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 mt-3">
            <input
              placeholder="Record title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3 outline-none text-sm"
            />

            <select
              value={form.recordType}
              onChange={(e) =>
                setForm({ ...form, recordType: e.target.value })
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3 outline-none text-sm font-bold"
            >
              <option value="LAB_REPORT">Lab Report</option>
              <option value="PRESCRIPTION">Prescription</option>
              <option value="XRAY">X-Ray</option>
              <option value="MRI">MRI</option>
              <option value="DISCHARGE_SUMMARY">Discharge Summary</option>
            </select>
          </div>

          <button
            type="button"
            onClick={createRecord}
            disabled={saving || uploading || !form.fileUrl}
            className="w-full mt-3 flex items-center justify-center gap-2 bg-cyan-600 text-white py-3.5 rounded-2xl font-black disabled:bg-slate-400"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <FileText size={18} />
            )}
            {saving ? "Saving..." : "Save Record"}
          </button>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-3 mt-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3">
            <Search size={17} className="text-cyan-600" />

            <input
              placeholder="Search records"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none text-sm"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-slate-400"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto mt-2 pb-1">
            {FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setTypeFilter(filter.value)}
                className={`shrink-0 px-3 py-2 rounded-full text-xs font-black border ${
                  typeFilter === filter.value
                    ? "bg-cyan-600 text-white border-cyan-600"
                    : "bg-white text-slate-600 border-slate-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-3">
          {loading ? (
            <RecordsSkeleton />
          ) : filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-5">
              {Object.entries(groupedRecords)
                .sort(([a], [b]) => Number(b) - Number(a))
                .map(([year, items]) => (
                  <div key={year}>
                    <h2 className="text-lg font-black text-slate-950 mb-2">
                      {year}
                    </h2>

                    <div className="space-y-3">
                      {items.map((record) => (
                        <RecordCard
                          key={record.id}
                          record={record}
                          isImage={isImage}
                          deleteRecord={deleteRecord}
                          downloadAsPdf={downloadAsPdf}
                          openMenuId={openMenuId}
                          setOpenMenuId={setOpenMenuId}
                          setPreviewRecord={setPreviewRecord}
                        />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>
      </div>

      {previewRecord && (
        <PreviewModal
          record={previewRecord}
          isImage={isImage}
          onClose={() => setPreviewRecord(null)}
          downloadAsPdf={downloadAsPdf}
        />
      )}

      {showProfilePicker && (
        <ProfilePicker
          profiles={profiles}
          activeProfile={activeProfile}
          onSelect={switchProfile}
          onClose={() => setShowProfilePicker(false)}
        />
      )}
    </main>
  );
}

function VaultStat({ label, value }) {
  return (
    <div className="bg-white/10 rounded-2xl p-2 text-center">
      <p className="text-lg font-black">{value}</p>
      <p className="text-[10px] text-slate-300 font-bold">{label}</p>
    </div>
  );
}

function RecordCard({
  record,
  isImage,
  deleteRecord,
  downloadAsPdf,
  openMenuId,
  setOpenMenuId,
  setPreviewRecord,
}) {
  const typeLabel = record.recordType?.replaceAll("_", " ") || "Record";
  const isMenuOpen = openMenuId === record.id;
  const familyMember = record.familyMember || null;

  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 relative">
      <div className="flex gap-3">
        <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center overflow-hidden border border-cyan-100 shrink-0">
          {isImage(record.fileUrl) ? (
            <img
              src={record.fileUrl}
              alt={record.title}
              className="w-full h-full object-cover"
            />
          ) : record.recordType === "PRESCRIPTION" ? (
            <Stethoscope className="text-cyan-600" size={25} />
          ) : record.recordType === "XRAY" || record.recordType === "MRI" ? (
            <Image className="text-cyan-600" size={25} />
          ) : (
            <FileText className="text-cyan-600" size={26} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-cyan-50 text-cyan-700 font-black text-[10px] mb-1">
            <ShieldCheck size={11} />
            {typeLabel}
          </div>

          <h3 className="font-black text-slate-950 truncate">{record.title}</h3>

          <p className="text-xs text-slate-500 mt-1 truncate">
            {record.fileName || "Medical document"}
          </p>

          <p className="text-[11px] text-slate-400 mt-1">
            {record.uploadedAt
              ? new Date(record.uploadedAt).toLocaleDateString()
              : "Uploaded"}
          </p>

          {familyMember && (
            <span className="inline-flex mt-2 px-2 py-1 rounded-full bg-cyan-50 text-cyan-700 text-[10px] font-black">
              {familyMember.fullName} • {familyMember.relation}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpenMenuId(isMenuOpen ? null : record.id)}
          className="w-9 h-9 rounded-2xl bg-slate-50 flex items-center justify-center"
        >
          <MoreVertical size={18} className="text-slate-600" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2 mt-3">
        <button
          type="button"
          onClick={() => setPreviewRecord(record)}
          className="flex items-center justify-center gap-1.5 bg-cyan-600 text-white py-2.5 rounded-2xl font-black text-xs"
        >
          <Eye size={15} />
          Preview Record
        </button>
      </div>

      {isMenuOpen && (
        <div className="mt-3 bg-slate-50 border border-slate-100 rounded-2xl p-2 space-y-2">
          <a
            href={record.fileUrl}
            download
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-black text-slate-800"
          >
            <Download size={16} className="text-cyan-600" />
            Download File
          </a>

          <button
            type="button"
            onClick={() => downloadAsPdf(record)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-black text-slate-800"
          >
            <FileDown size={16} className="text-emerald-600" />
            Download PDF
          </button>

          <button
            type="button"
            onClick={() => deleteRecord(record.id)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-black text-red-600"
          >
            <Trash2 size={16} />
            Delete Record
          </button>
        </div>
      )}
    </div>
  );
}

function PreviewModal({ record, isImage, onClose, downloadAsPdf }) {
  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-end">
      <div className="w-full bg-white rounded-t-[2rem] p-4 pb-6 max-h-[88vh] overflow-y-auto">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <h2 className="text-lg font-black text-slate-950 truncate">
                {record.title}
              </h2>

              <p className="text-xs text-slate-500">
                {record.recordType?.replaceAll("_", " ")}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-4 bg-slate-50 border border-slate-100 rounded-3xl p-3 min-h-[240px] flex items-center justify-center">
            {isImage(record.fileUrl) ? (
              <img
                src={record.fileUrl}
                alt={record.title}
                className="max-h-[420px] rounded-2xl object-contain"
              />
            ) : (
              <div className="text-center p-5">
                <FileText className="text-cyan-600 mx-auto mb-3" size={44} />

                <p className="font-black text-slate-950">
                  File preview not available
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  Open or download the file to view it.
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3">
            <a
              href={record.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-cyan-600 text-white py-3 rounded-2xl font-black text-sm text-center"
            >
              Open
            </a>

            <button
              type="button"
              onClick={() => downloadAsPdf(record)}
              className="bg-slate-950 text-white py-3 rounded-2xl font-black text-sm"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfilePicker({ profiles, activeProfile, onSelect, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-end">
      <div className="w-full bg-white rounded-t-[2rem] p-4 pb-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-950">
              Switch Profile
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {profiles.map((profile) => {
              const active = activeProfile?.id === profile.id;

              return (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => onSelect(profile)}
                  className={`w-full flex items-center gap-3 rounded-2xl p-3 text-left border ${
                    active
                      ? "bg-cyan-50 border-cyan-200"
                      : "bg-slate-50 border-slate-100"
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 overflow-hidden flex items-center justify-center">
                    {profile.profileImage ? (
                      <img
                        src={profile.profileImage}
                        alt={profile.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserRound className="text-cyan-600" size={24} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-slate-950 truncate">
                      {profile.fullName}
                    </h3>

                    <p className="text-xs text-slate-500">
                      {profile.relation || "SELF"}
                    </p>
                  </div>

                  {active && (
                    <div className="w-7 h-7 rounded-full bg-cyan-600 flex items-center justify-center">
                      <Check className="text-white" size={16} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function RecordsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 animate-pulse"
        >
          <div className="flex gap-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100" />

            <div className="flex-1">
              <div className="h-4 bg-slate-100 rounded-full w-32" />
              <div className="h-5 bg-slate-100 rounded-full w-44 mt-3" />
              <div className="h-3 bg-slate-100 rounded-full w-28 mt-2" />
            </div>
          </div>

          <div className="h-11 bg-slate-100 rounded-2xl mt-3" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-3xl p-6 text-center shadow-sm border border-slate-100">
      <FileText className="mx-auto text-slate-300 mb-3" size={34} />

      <h3 className="font-black text-slate-950">No records found</h3>

      <p className="text-sm text-slate-500 mt-1">
        Upload your first medical document for this profile.
      </p>
    </div>
  );
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}