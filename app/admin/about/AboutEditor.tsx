"use client";

import { useActionState, useState } from "react";
import type { ReactNode } from "react";
import type { AboutData } from "@/app/data/about";
import { saveAbout } from "./actions";

const inputClass = "mt-2 w-full rounded-xl border border-[var(--border-color)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-border)]";
function Field({ label, value, onChange, multiline = false, type = "text", optional = false }: {
  label: string; value: string; onChange: (value: string) => void; multiline?: boolean; type?: string; optional?: boolean;
}) {
  return <label className="block min-w-0 text-sm font-medium">{label}
    {multiline ? <textarea className={inputClass} rows={4} value={value} onChange={event => onChange(event.target.value)} required={!optional} maxLength={10000} />
      : <input className={inputClass} type={type} value={value} onChange={event => onChange(event.target.value)} required={!optional} maxLength={2048} />}
  </label>;
}
function Section({ title, children, add }: { title: string; children: ReactNode; add?: () => void }) {
  return <section id={`edit-${title.toLowerCase()}`} className="scroll-mt-6 rounded-2xl border border-[var(--border-color)] bg-[var(--background)] p-5 md:p-8">
    <div className="mb-6 flex items-center justify-between gap-4"><h2 className="text-xl font-semibold tracking-tight">{title}</h2>{add && <button type="button" onClick={add} className="shrink-0 cursor-pointer rounded-full border border-[var(--accent-border)] px-4 py-2 text-xs font-semibold text-[var(--accent)] hover:bg-[var(--accent-soft)]">+ Add</button>}</div>
    <div className="space-y-6">{children}</div>
  </section>;
}
function Item({ title, children, remove, move, first, last }: {
  title: string; children: ReactNode; remove: () => void; move: (direction: number) => void; first: boolean; last: boolean;
}) {
  return <div className="rounded-xl border border-[var(--border-color)] p-4 md:p-6">
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h3 className="text-sm font-semibold">{title}</h3><div className="flex items-center gap-3 text-xs">
      <button type="button" disabled={first} onClick={() => move(-1)} aria-label={`Move ${title} up`} className="cursor-pointer p-2 disabled:opacity-25">↑</button>
      <button type="button" disabled={last} onClick={() => move(1)} aria-label={`Move ${title} down`} className="cursor-pointer p-2 disabled:opacity-25">↓</button>
      <button type="button" onClick={remove} className="cursor-pointer rounded-lg px-2 py-2 text-red-500 hover:bg-red-500/10" aria-label={`Remove ${title}`}>Remove</button>
    </div></div><div className="space-y-4">{children}</div>
  </div>;
}
const lines = (value: string) => value.split("\n");
const cleanLines = (value: string[]) => value.map(line => line.trim()).filter(Boolean);
const nextId = (items: { id: number }[]) => Math.max(0, ...items.map(item => item.id)) + 1;

export default function AboutEditor({ initialData }: { initialData: AboutData }) {
  const [data, setData] = useState(initialData);
  const [state, action, pending] = useActionState(saveAbout, {});
  const payload = JSON.stringify({ ...data, experience: data.experience.map(item => ({ ...item, description: cleanLines(item.description) })), skills: data.skills.map(item => ({ ...item, skills: cleanLines(item.skills) })) });
  const initialPayload = JSON.stringify(initialData);
  const saved = state.saved === payload;
  const changed = state.saved ? !saved : payload !== initialPayload;
  function set<K extends keyof AboutData>(key: K, value: AboutData[K]) { setData(previous => ({ ...previous, [key]: value })); }
  function itemControls<K extends "experience" | "education" | "skills" | "languages">(key: K, index: number) {
    return {
      first: index === 0, last: index === data[key].length - 1,
      remove: () => set(key, data[key].filter((_, itemIndex) => itemIndex !== index) as AboutData[K]),
      move: (direction: number) => {
        const items = [...data[key]];
        const target = index + direction;
        if (target < 0 || target >= items.length) return;
        [items[index], items[target]] = [items[target], items[index]];
        set(key, items as AboutData[K]);
      },
    };
  }
  return <form action={action}>
    <input type="hidden" name="content" value={payload} />
    <fieldset disabled={pending} className="space-y-6 disabled:opacity-70">
      <Section title="Profile">
        <div className="grid gap-5 md:grid-cols-2"><Field label="Name" value={data.name} onChange={value => set("name", value)} /><Field label="Title" value={data.title} onChange={value => set("title", value)} /></div>
        <Field label="Location" value={data.location} onChange={value => set("location", value)} />
        <Field label="Introduction" multiline value={data.introduction} onChange={value => set("introduction", value)} />
        <Field label="Description" multiline value={data.description} onChange={value => set("description", value)} />
        <div className="grid gap-5 md:grid-cols-2"><Field label="GitHub URL" type="url" optional value={data.socialLinks.github} onChange={value => set("socialLinks", { ...data.socialLinks, github: value })} /><Field label="LinkedIn URL" type="url" optional value={data.socialLinks.linkedin} onChange={value => set("socialLinks", { ...data.socialLinks, linkedin: value })} /></div>
      </Section>
      <Section title="Experience" add={() => set("experience", [...data.experience, { id: nextId(data.experience), position: "", company: "", startDate: "", endDate: null, description: [] }])}>
        {data.experience.length === 0 && <p className="text-sm text-[var(--secondary-text)]">Add your first role.</p>}
        {data.experience.map((item, index) => {
          const update = (patch: Partial<typeof item>) => set("experience", data.experience.map((entry, i) => i === index ? { ...entry, ...patch } : entry));
          return <Item key={item.id} title={`Experience ${index + 1}`} {...itemControls("experience", index)}>
            <div className="grid gap-4 md:grid-cols-2"><Field label="Position" value={item.position} onChange={position => update({ position })} /><Field label="Company" value={item.company} onChange={company => update({ company })} /></div>
            <div className="grid gap-4 md:grid-cols-2"><Field label="Start date" type="date" value={item.startDate} onChange={startDate => update({ startDate })} />{item.endDate !== null && <Field label="End date" type="date" value={item.endDate} onChange={endDate => update({ endDate })} />}</div>
            <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={item.endDate === null} onChange={event => update({ endDate: event.target.checked ? null : "" })} className="accent-[var(--accent)]" />I currently work here</label>
            <Field label="Responsibilities — one per line" multiline optional value={item.description.join("\n")} onChange={value => update({ description: lines(value) })} />
          </Item>;
        })}
      </Section>
      <Section title="Education" add={() => set("education", [...data.education, { id: nextId(data.education), institution: "", program: "", startDate: "", endDate: "" }])}>
        {data.education.length === 0 && <p className="text-sm text-[var(--secondary-text)]">Add your education.</p>}
        {data.education.map((item, index) => {
          const update = (patch: Partial<typeof item>) => set("education", data.education.map((entry, i) => i === index ? { ...entry, ...patch } : entry));
          return <Item key={item.id} title={`Education ${index + 1}`} {...itemControls("education", index)}>
            <Field label="Institution" value={item.institution} onChange={institution => update({ institution })} /><Field label="Program" value={item.program} onChange={program => update({ program })} />
            <div className="grid gap-4 md:grid-cols-2"><Field label="Start date" type="date" value={item.startDate} onChange={startDate => update({ startDate })} /><Field label="End date" type="date" value={item.endDate} onChange={endDate => update({ endDate })} /></div>
          </Item>;
        })}
      </Section>
      <Section title="Skills" add={() => set("skills", [...data.skills, { id: nextId(data.skills), category: "", skills: [] }])}>
        {data.skills.length === 0 && <p className="text-sm text-[var(--secondary-text)]">Add a skill category.</p>}
        {data.skills.map((item, index) => {
          const update = (patch: Partial<typeof item>) => set("skills", data.skills.map((entry, i) => i === index ? { ...entry, ...patch } : entry));
          return <Item key={item.id} title={`Skill group ${index + 1}`} {...itemControls("skills", index)}><Field label="Category" value={item.category} onChange={category => update({ category })} /><Field label="Skills — one per line" multiline value={item.skills.join("\n")} onChange={value => update({ skills: lines(value) })} /></Item>;
        })}
      </Section>
      <Section title="Languages" add={() => set("languages", [...data.languages, { name: "", level: "" }])}>
        {data.languages.length === 0 && <p className="text-sm text-[var(--secondary-text)]">Add a language.</p>}
        {data.languages.map((item, index) => <Item key={index} title={`Language ${index + 1}`} {...itemControls("languages", index)}>
          <div className="grid gap-4 md:grid-cols-2"><Field label="Language" value={item.name} onChange={name => set("languages", data.languages.map((entry, i) => i === index ? { ...entry, name } : entry))} /><Field label="Level" value={item.level} onChange={level => set("languages", data.languages.map((entry, i) => i === index ? { ...entry, level } : entry))} /></div>
        </Item>)}
      </Section>
    </fieldset>
    <div className="sticky bottom-4 z-10 mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--border-color)] bg-[var(--background)] p-4 shadow-lg md:p-5">
      <div aria-live="polite" className="min-w-0 text-sm">{pending ? "Saving…" : state.error ? <p role="alert" className="text-red-500">{state.error}</p> : saved ? <p className="text-[var(--accent)]">Saved. Your About section is live.</p> : changed ? "You have unsaved changes." : "Ready to edit."}</div>
      <button type="submit" disabled={pending || !changed} className="cursor-pointer rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--accent-on)] disabled:cursor-not-allowed disabled:opacity-50">{pending ? "Saving…" : "Save changes"}</button>
    </div>
  </form>;
}
