import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Upload,
  Trash2,
  Search,
  Download,
  Plus,
  Loader2,
  Image,
  FileUp,
  ShieldCheck,
  CalendarCheck,
  ClipboardList,
  X,
  Filter,
  Eye,
} from "lucide-react";
import api from "../api/axios";

export default function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const [form, setForm] = useState({
    title: "",
    recordType: "LAB_REPORT",
    fileUrl: "",
    fileName: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await api.get("/medical-record/my");
      setRecords(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setUploading(true);

      const res = await api.post("/medical-record/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setForm((prev) => ({
        ...prev,
        fileUrl: res.data.fileUrl,
        fileName: res.data.fileName,
        title: prev.title || res.data.fileName?.replace(/\.[^/.]+$/, ""),
      }));

      alert("File uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.response?.data?.message || "File upload failed");
    } finally {
      setUploading(false);
    }
  };

  const createRecord = async () => {
    if (!form.title || !form.recordType || !form.fileUrl) {
      alert("Title, record type and uploaded file are required");
      return;
    }

    try {
      setSaving(true);

      await api.post("/medical-record", form);

      setForm({
        title: "",
        recordType: "LAB_REPORT",
        fileUrl: "",
        fileName: "",
      });

      setSelectedFile(null);
      fetchRecords();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to save record");
    } finally {
      setSaving(false);
    }
  };

  const deleteRecord = async (id) => {
    if (!window.confirm("Delete record?")) return;

    try {
      await api.delete(`/medical-record/${id}`);
      fetchRecords();
    } catch (error) {
      console.error(error);
    }
  };

  const filtered = records.filter((item) => {
    const matchesSearch = `${item.title} ${item.recordType} ${
      item.fileName || ""
    }`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesType =
      typeFilter === "ALL" || item.recordType === typeFilter;

    return matchesSearch && matchesType;
  });

  const stats = useMemo(() => {
    return {
      total: records.length,
      labReports: records.filter((r) => r.recordType === "LAB_REPORT").length,
      prescriptions: records.filter((r) => r.recordType === "PRESCRIPTION")
        .length,
      scans: records.filter((r) =>
        ["XRAY", "MRI"].includes(r.recordType)
      ).length,
    };
  }, [records]);

  const isImage = (url = "") =>
    url.match(/\.(jpg|jpeg|png|webp|gif)$/i);

  const clearUpload = () => {
    setSelectedFile(null);
    setForm({
      title: "",
      recordType: "LAB_REPORT",
      fileUrl: "",
      fileName: "",
    });
  };

  return (
    <div className="min-h-screen bg-[#f4fbff]">
      <div className="max-w-[1450px] mx-auto px-6 py-8">
        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 mb-8">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm mb-4">
                <FileText size={17} />
                MEDICAL RECORDS
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-950">
                Your Health Documents
              </h1>

              <p className="text-slate-500 mt-3 max-w-2xl text-lg leading-relaxed">
                Upload and manage lab reports, prescriptions, scans and
                discharge summaries securely in one place.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <MiniStat title="Total" value={stats.total} icon={ClipboardList} />
              <MiniStat title="Reports" value={stats.labReports} icon={FileText} />
              <MiniStat
                title="Rx"
                value={stats.prescriptions}
                icon={ShieldCheck}
              />
              <MiniStat title="Scans" value={stats.scans} icon={Image} />
            </div>
          </div>
        </section>

        <section className="grid xl:grid-cols-[430px_1fr] gap-8 mb-8">
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 h-fit xl:sticky xl:top-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center">
                <Plus className="text-cyan-600" size={24} />
              </div>

              <div>
                <h2 className="font-black text-2xl text-slate-950">
                  Upload Record
                </h2>

                <p className="text-slate-500 text-sm">
                  Add a new health document
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <label className="block">
                <p className="text-sm font-black text-slate-700 mb-2">
                  Select File
                </p>

                <div className="border-2 border-dashed border-cyan-200 bg-cyan-50/50 rounded-[2rem] p-8 text-center hover:bg-cyan-50 transition">
                  <FileUp
                    className="mx-auto text-cyan-600 mb-4"
                    size={42}
                  />

                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    onChange={(e) =>
                      setSelectedFile(e.target.files?.[0] || null)
                    }
                    className="hidden"
                    id="medical-file-upload"
                  />

                  <label
                    htmlFor="medical-file-upload"
                    className="inline-flex cursor-pointer bg-cyan-600 text-white px-5 py-3 rounded-2xl font-black hover:bg-cyan-700"
                  >
                    Browse File
                  </label>

                  <p className="text-sm text-slate-500 mt-4">
                    PDF, JPG, PNG, WEBP supported
                  </p>

                  {selectedFile && (
                    <div className="mt-4 bg-white rounded-2xl border border-cyan-100 p-3">
                      <p className="font-black text-slate-800 break-all">
                        {selectedFile.name}
                      </p>
                    </div>
                  )}
                </div>
              </label>

              <button
                onClick={uploadFile}
                disabled={uploading || !selectedFile}
                className="w-full flex items-center justify-center gap-2 bg-slate-950 text-white px-5 py-4 rounded-2xl font-black hover:bg-cyan-700 disabled:bg-slate-400"
              >
                {uploading ? (
                  <Loader2 className="animate-spin" size={19} />
                ) : (
                  <Upload size={19} />
                )}
                {uploading ? "Uploading..." : "Upload File"}
              </button>

              <div>
                <p className="text-sm font-black text-slate-700 mb-2">
                  Record Title
                </p>

                <input
                  placeholder="Example: Blood Test Report"
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <p className="text-sm font-black text-slate-700 mb-2">
                  Record Type
                </p>

                <select
                  value={form.recordType}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      recordType: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="LAB_REPORT">Lab Report</option>
                  <option value="PRESCRIPTION">Prescription</option>
                  <option value="XRAY">X-Ray</option>
                  <option value="MRI">MRI</option>
                  <option value="DISCHARGE_SUMMARY">
                    Discharge Summary
                  </option>
                </select>
              </div>

              {form.fileUrl && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-emerald-700">
                        File uploaded successfully
                      </p>

                      <p className="text-sm text-emerald-700 break-all mt-1">
                        {form.fileName}
                      </p>
                    </div>

                    <button onClick={clearUpload}>
                      <X className="text-emerald-700" size={18} />
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={createRecord}
                disabled={saving || !form.fileUrl}
                className="w-full flex items-center justify-center gap-2 bg-cyan-600 text-white px-5 py-4 rounded-2xl font-black hover:bg-cyan-700 transition disabled:bg-slate-400"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={19} />
                ) : (
                  <FileText size={19} />
                )}
                {saving ? "Saving..." : "Save Medical Record"}
              </button>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 mb-6">
              <div className="grid lg:grid-cols-[1fr_260px] gap-4">
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
                  <Search size={18} className="text-cyan-600" />

                  <input
                    placeholder="Search records..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-transparent outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
                  <Filter size={18} className="text-cyan-600" />

                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full bg-transparent outline-none font-semibold text-slate-800"
                  >
                    <option value="ALL">All Records</option>
                    <option value="LAB_REPORT">Lab Reports</option>
                    <option value="PRESCRIPTION">Prescriptions</option>
                    <option value="XRAY">X-Ray</option>
                    <option value="MRI">MRI</option>
                    <option value="DISCHARGE_SUMMARY">
                      Discharge Summary
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid gap-5">
              {filtered.map((record) => (
                <RecordCard
                  key={record.id}
                  record={record}
                  isImage={isImage}
                  deleteRecord={deleteRecord}
                />
              ))}

              {filtered.length === 0 && (
                <div className="bg-white rounded-[2rem] p-10 text-center shadow-sm border border-slate-100">
                  <FileText
                    className="mx-auto text-slate-300 mb-4"
                    size={44}
                  />

                  <h3 className="font-black text-xl text-slate-950">
                    No Records Found
                  </h3>

                  <p className="text-slate-500 mt-2">
                    Upload your first medical document.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function RecordCard({ record, isImage, deleteRecord }) {
  const typeLabel = record.recordType?.replaceAll("_", " ") || "Record";

  return (
    <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 hover:shadow-xl transition">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-20 h-20 rounded-3xl bg-cyan-50 flex items-center justify-center overflow-hidden border border-cyan-100 shrink-0">
            {isImage(record.fileUrl) ? (
              <img
                src={record.fileUrl}
                alt={record.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <FileText className="text-cyan-600" size={34} />
            )}
          </div>

          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 font-black text-xs mb-2">
              <ShieldCheck size={14} />
              {typeLabel}
            </div>

            <h3 className="font-black text-xl text-slate-950 truncate">
              {record.title}
            </h3>

            <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1">
                <CalendarCheck size={15} />
                {record.uploadedAt
                  ? new Date(record.uploadedAt).toLocaleString()
                  : "Uploaded"}
              </span>

              {record.fileName && (
                <span className="truncate max-w-[280px]">
                  {record.fileName}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={record.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-cyan-600 text-white px-4 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-cyan-700"
          >
            <Eye size={16} />
            Open
          </a>

          <a
            href={record.fileUrl}
            download
            className="bg-slate-950 text-white px-4 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-cyan-700"
          >
            <Download size={16} />
            Download
          </a>

          <button
            onClick={() => deleteRecord(record.id)}
            className="bg-red-600 text-white px-4 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-red-700"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ title, value, icon: Icon }) {
  return (
    <div className="min-w-[90px] bg-slate-50 rounded-2xl border border-slate-100 p-3">
      <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center mb-2">
        <Icon className="text-cyan-600" size={18} />
      </div>

      <p className="text-xl font-black text-slate-950">{value}</p>

      <p className="text-xs text-slate-500 font-bold">{title}</p>
    </div>
  );
}