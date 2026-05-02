import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Edit3, Search, SlidersHorizontal, Trash2, X } from "lucide-react";

const PAGE_SIZE = 6;

export function ContactTable({ contacts, onDelete, onUpdate }) {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("All");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const haystack = [
        contact.name,
        contact.company,
        contact.email,
        contact.location,
        contact.state,
        contact.city,
        ...(contact.phones || []),
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery = haystack.includes(query.toLowerCase());
      const matchesLanguage = language === "All" || contact.language === language;

      return matchesQuery && matchesLanguage;
    });
  }, [contacts, language, query]);

  const pageCount = Math.max(1, Math.ceil(filteredContacts.length / PAGE_SIZE));
  const visibleContacts = filteredContacts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleQuery = (value) => {
    setQuery(value);
    setPage(1);
  };

  const handleLanguage = (value) => {
    setLanguage(value);
    setPage(1);
  };

  return (
    <section className="premium-panel rounded-[18px] p-5 fade-slide">
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-lg font-bold text-ink">Saved Contacts</h2>
          <p className="mt-1 text-sm text-brand/60">Search, filter, edit, and delete scanned contacts.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex min-w-[260px] items-center rounded-2xl border border-brand/10 bg-white px-4 py-3 text-sm text-brand/50 shadow-sm transition focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/20">
            <Search className="mr-3 h-4 w-4" />
            <input
              className="w-full bg-transparent outline-none placeholder:text-brand/40"
              onChange={(event) => handleQuery(event.target.value)}
              placeholder="Search contacts"
              value={query}
            />
          </label>
          <label className="flex items-center rounded-2xl border border-brand/10 bg-white px-4 py-3 text-sm text-brand/60 shadow-sm">
            <SlidersHorizontal className="mr-3 h-4 w-4" />
            <select
              className="bg-transparent font-semibold outline-none"
              onChange={(event) => handleLanguage(event.target.value)}
              value={language}
            >
              <option>All</option>
              <option>EN</option>
              <option>HI</option>
              <option>GU</option>
            </select>
          </label>
        </div>
      </div>

      <div className="overflow-hidden rounded-[18px] border border-brand/10 bg-white/75">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-left text-sm">
            <thead>
              <tr className="border-b border-brand/10 bg-brand/[0.035] text-xs uppercase tracking-[0.16em] text-brand/50">
                <th className="px-5 py-4 font-bold">Name</th>
                <th className="px-5 py-4 font-bold">Phone</th>
                <th className="px-5 py-4 font-bold">Email</th>
                <th className="px-5 py-4 font-bold">Company</th>
                <th className="px-5 py-4 font-bold">Location</th>
                <th className="px-5 py-4 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand/10">
              {visibleContacts.map((contact) => (
                <tr className="transition hover:bg-sky-50/50" key={contact.id}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand text-xs font-bold text-white">
                        {contact.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                      <div>
                        <p className="font-bold text-ink">{contact.name}</p>
                        <p className="text-xs text-brand/50">{contact.language} · {contact.scannedAt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-medium text-brand/70">{contact.phones?.[0] || "-"}</td>
                  <td className="px-5 py-4 text-brand/75">{contact.email || "-"}</td>
                  <td className="px-5 py-4 text-brand/75">{contact.company || "-"}</td>
                  <td className="px-5 py-4 text-brand/75">
                    {[contact.location, contact.state, contact.city].filter(Boolean).join(", ") || "-"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        className="rounded-xl border border-brand/10 bg-white p-2 text-brand/60 transition hover:-translate-y-0.5 hover:text-brand hover:shadow-sm"
                        onClick={() => setEditing(contact)}
                        type="button"
                        aria-label={`Edit ${contact.name}`}
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        className="rounded-xl border border-brand/10 bg-white p-2 text-brand/50 transition hover:-translate-y-0.5 hover:border-red-100 hover:bg-red-50 hover:text-red-600 hover:shadow-sm"
                        onClick={() => onDelete(contact.id)}
                        type="button"
                        aria-label={`Delete ${contact.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {visibleContacts.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="font-semibold text-brand/70">No contacts found</p>
            <p className="mt-1 text-sm text-brand/50">Adjust search or language filters.</p>
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-brand/50">
          Showing {visibleContacts.length} of {filteredContacts.length} contacts
        </p>
        <div className="flex items-center gap-2">
          <button
            className="rounded-2xl border border-brand/10 bg-white p-2.5 text-brand transition hover:-translate-y-0.5 hover:shadow-sm disabled:opacity-40"
            disabled={page === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            type="button"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="rounded-2xl bg-brand/10 px-4 py-2 text-sm font-bold text-brand">
            {page} / {pageCount}
          </span>
          <button
            className="rounded-2xl border border-brand/10 bg-white p-2.5 text-brand transition hover:-translate-y-0.5 hover:shadow-sm disabled:opacity-40"
            disabled={page === pageCount}
            onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
            type="button"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {editing ? (
        <EditContactModal
          contact={editing}
          onClose={() => setEditing(null)}
          onSave={(updatedContact) => {
            onUpdate(updatedContact);
            setEditing(null);
          }}
        />
      ) : null}
    </section>
  );
}

function EditContactModal({ contact, onClose, onSave }) {
  const [draft, setDraft] = useState({
    ...contact,
    phones: contact.phones?.join(", ") || "",
  });

  const update = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[18px] border border-brand/10 bg-white p-5 shadow-lift">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-ink">Edit Contact</h3>
            <p className="mt-1 text-sm text-brand/60">Update saved contact data.</p>
          </div>
          <button
            className="rounded-xl p-2 text-brand/50 transition hover:bg-brand/5 hover:text-brand"
            onClick={onClose}
            type="button"
            aria-label="Close editor"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["name", "Name"],
            ["email", "Email"],
            ["phones", "Phone(s)"],
            ["company", "Company"],
            ["location", "Location"],
            ["state", "State"],
            ["city", "City"],
          ].map(([field, label]) => (
            <label className={field === "location" ? "space-y-2 sm:col-span-2" : "space-y-2"} key={field}>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-brand/50">{label}</span>
              <input
                className="focus-ring w-full rounded-2xl border border-brand/10 bg-white px-4 py-3 text-sm text-ink shadow-sm"
                onChange={(event) => update(field, event.target.value)}
                value={draft[field] || ""}
              />
            </label>
          ))}
          <label className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-brand/50">Language</span>
            <select
              className="focus-ring w-full rounded-2xl border border-brand/10 bg-white px-4 py-3 text-sm font-semibold text-ink shadow-sm"
              onChange={(event) => update("language", event.target.value)}
              value={draft.language}
            >
              <option>EN</option>
              <option>HI</option>
              <option>GU</option>
            </select>
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            className="rounded-2xl border border-brand/10 bg-white px-5 py-3 text-sm font-bold text-brand transition hover:-translate-y-0.5 hover:shadow-sm"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="gradient-button rounded-2xl px-5 py-3 text-sm font-bold text-white"
            onClick={() =>
              onSave({
                ...draft,
                phones: draft.phones
                  .split(",")
                  .map((phone) => phone.trim())
                  .filter(Boolean),
              })
            }
            type="button"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
