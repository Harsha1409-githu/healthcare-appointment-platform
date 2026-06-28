export default function LabTestsCard({
  form,
  setForm,
  labInput,
  setLabInput,
  commonTests,
}) {
  const addLabTest = (testName = labInput) => {
    const value = testName.trim();
    if (!value) return;

    if (form.labTests.includes(value)) return;

    setForm({
      ...form,
      labTests: [...form.labTests, value],
    });

    setLabInput("");
  };

  const removeLabTest = (index) => {
    setForm({
      ...form,
      labTests: form.labTests.filter((_, i) => i !== index),
    });
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-2">
        {commonTests.map((test) => (
          <button
            key={test}
            type="button"
            onClick={() => addLabTest(test)}
            className={`rounded-2xl px-2 py-2 text-[10px] font-black active:scale-95 ${
              form.labTests.includes(test)
                ? "bg-cyan-600 text-white"
                : "bg-slate-50 text-slate-700"
            }`}
          >
            + {test}
          </button>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={labInput}
          onChange={(e) => setLabInput(e.target.value)}
          placeholder="Custom test"
          className="h-12 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-cyan-500"
        />

        <button
          type="button"
          onClick={() => addLabTest()}
          className="h-12 rounded-2xl bg-slate-950 px-4 text-xs font-black text-white"
        >
          Add
        </button>
      </div>

      {form.labTests.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {form.labTests.map((test, index) => (
            <button
              key={`${test}-${index}`}
              type="button"
              onClick={() => removeLabTest(index)}
              className="rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-black text-cyan-700"
            >
              {test} ×
            </button>
          ))}
        </div>
      )}
    </>
  );
}