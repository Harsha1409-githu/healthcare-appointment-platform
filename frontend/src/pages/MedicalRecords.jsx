import { useEffect, useState } from "react";
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
} from "lucide-react";
import api from "../api/axios";

export default function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");

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

      const res = await api.post(
        "/medical-record/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setForm((prev) => ({
        ...prev,
        fileUrl: res.data.fileUrl,
        fileName: res.data.fileName,
        title:
          prev.title ||
          res.data.fileName?.replace(/\.[^/.]+$/, ""),
      }));

      alert("File uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      alert(
        error.response?.data?.message ||
          "File upload failed"
      );
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
      alert(
        error.response?.data?.message ||
          "Failed to save record"
      );
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

  const filtered = records.filter((item) =>
    `${item.title} ${item.recordType} ${item.fileName || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const isImage = (url = "") =>
    url.match(/\.(jpg|jpeg|png|webp|gif)$/i);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/40 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 text-white rounded-[2rem] p-8 mb-8 shadow-2xl">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />

          <div className="relative">
            <div className="w-16 h-16 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center mb-5">
              <FileText size={34} className="text-cyan-300" />
            </div>

            <h1 className="text-4xl font-black">
              Medical Records
            </h1>

            <p className="text-blue-100 mt-2 max-w-2xl">
              Upload lab reports, scans, prescriptions and discharge summaries
              securely to your medical history.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100 mb-8">
          <div className="flex items-center gap-2 mb-5">
            <Plus className="text-blue-600" />
            <h2 className="font-black text-xl text-slate-900">
              Upload New Record
            </h2>
          </div>

          <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
            <div>
              <label className="block">
                <p className="text-sm font-bold text-slate-600 mb-2">
                  Select File
                </p>

                <div className="border-2 border-dashed border-blue-200 bg-blue-50/40 rounded-[2rem] p-8 text-center hover:bg-blue-50 transition">
                  <FileUp
                    className="mx-auto text-blue-600 mb-4"
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
                    className="inline-flex cursor-pointer bg-blue-600 text-white px-5 py-3 rounded-2xl font-black hover:bg-blue-700"
                  >
                    Browse File
                  </label>

                  <p className="text-sm text-slate-500 mt-4">
                    PDF, JPG, PNG, WEBP supported
                  </p>

                  {selectedFile && (
                    <p className="mt-4 font-bold text-slate-800 break-all">
                      {selectedFile.name}
                    </p>
                  )}
                </div>
              </label>

              <button
                onClick={uploadFile}
                disabled={uploading || !selectedFile}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-slate-950 text-white px-5 py-4 rounded-2xl font-black hover:bg-blue-700 disabled:bg-slate-400"
              >
                {uploading ? (
                  <Loader2 className="animate-spin" size={19} />
                ) : (
                  <Upload size={19} />
                )}
                {uploading ? "Uploading..." : "Upload File"}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold text-slate-600 mb-2">
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-600 mb-2">
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500"
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
                  <p className="font-black text-emerald-700">
                    File uploaded successfully
                  </p>

                  <p className="text-sm text-emerald-700 break-all mt-1">
                    {form.fileName}
                  </p>
                </div>
              )}

              <button
                onClick={createRecord}
                disabled={saving || !form.fileUrl}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-4 rounded-2xl font-black hover:scale-[1.01] transition disabled:bg-slate-400 disabled:scale-100"
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
        </div>

        <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100 mb-6">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
            <Search size={18} className="text-blue-600" />

            <input
              placeholder="Search records..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none"
            />
          </div>
        </div>

        <div className="grid gap-5">
          {filtered.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-[2rem] p-5 shadow-xl border border-slate-100"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center overflow-hidden">
                    {isImage(record.fileUrl) ? (
                      <img
                        src={record.fileUrl}
                        alt={record.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image className="text-blue-600" size={30} />
                    )}
                  </div>

                  <div>
                    <h3 className="font-black text-lg text-slate-900">
                      {record.title}
                    </h3>

                    <p className="text-slate-500">
                      {record.recordType}
                    </p>

                    <p className="text-sm text-slate-400 mt-1">
                      {new Date(record.uploadedAt).toLocaleString()}
                    </p>

                    {record.fileName && (
                      <p className="text-xs text-slate-400 mt-1 break-all">
                        {record.fileName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <a
                    href={record.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-green-600 text-white px-4 py-3 rounded-2xl font-bold flex items-center gap-2"
                  >
                    <Download size={16} />
                    Open
                  </a>

                  <button
                    onClick={() => deleteRecord(record.id)}
                    className="bg-red-600 text-white px-4 py-3 rounded-2xl font-bold flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="bg-white rounded-[2rem] p-10 text-center shadow-xl border border-slate-100">
              <FileText
                className="mx-auto text-slate-300 mb-4"
                size={44}
              />

              <h3 className="font-black text-xl text-slate-900">
                No Records Found
              </h3>

              <p className="text-slate-500 mt-2">
                Upload your first medical document.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}