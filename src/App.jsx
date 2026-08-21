import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Copy, Music2, Pause } from "lucide-react";
import "./style.css";

const event = {
  couple: "Марат & Карина",
  dateIso: "2026-09-12T11:00:00+03:00",
  dateDisplay: "12 сентября 2026",
  timeDisplay: "11:00",
  basmala: "С именем Аллаха Милостивого, Милосердного",
  invitationText:
    "С благодарностью Всевышнему мы приглашаем Вас разделить с нами светлый и торжественный день нашего никаха. Ваше присутствие станет для нас искренней радостью и частью теплых воспоминаний.",
  guestText: "Будем счастливы разделить этот особенный день вместе с Вами.",
  venue: {
    name: "Банкетный зал «Nur»",
    address: "г. Казань, ул. Примерная, 12",
    time: "Сбор гостей в 10:40",
    mapUrl: "https://maps.google.com/?q=Kazan",
  },
  program: [
    { time: "11:00", title: "Никах" },
    { time: "13:00", title: "Праздничный обед" },
    { time: "15:00", title: "Завершение" },
  ],
  guests: {
    azat: "Азат",
    ruslan: "Руслан",
    amilya: "Амиля",
    marinarobert: "Марина и Роберт",
  },
  musicSrc: "",
};

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-zа-яё0-9_-]+/gi, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

function greeting(name) {
  const lower = name.toLowerCase();
  return [" и ", "&", ",", "+", "семья"].some((marker) => lower.includes(marker)) ? "Дорогие" : "Дорогой";
}

function useCountdown() {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return useMemo(() => {
    const diff = Math.max(0, new Date(event.dateIso).getTime() - now);
    const total = Math.floor(diff / 1000);
    return {
      days: Math.floor(total / 86400),
      hours: Math.floor((total % 86400) / 3600),
      minutes: Math.floor((total % 3600) / 60),
      seconds: total % 60,
    };
  }, [now]);
}

function InvitePage() {
  const [opened, setOpened] = useState(false);
  const [rsvp, setRsvp] = useState("");
  const [musicOn, setMusicOn] = useState(false);
  const countdown = useCountdown();
  const slug = window.location.pathname.startsWith("/invite/")
    ? decodeURIComponent(window.location.pathname.replace("/invite/", "").replace(/\/$/, ""))
    : "";
  const dynamicGuest = slug
    ? event.guests[slug] || slug.split("-").filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ")
    : "";
  const rsvpKey = `nikah-rsvp-${slug || "guest"}`;

  useEffect(() => {
    const reveal = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((node) => reveal.observe(node));
    return () => reveal.disconnect();
  }, [opened]);

  useEffect(() => {
    setRsvp(window.localStorage.getItem(rsvpKey) || "");
  }, [rsvpKey]);

  function saveRsvp(message) {
    window.localStorage.setItem(rsvpKey, message);
    setRsvp(message);
  }

  return (
    <main className={opened ? "site-shell opened" : "site-shell"}>
      <div className="ambient" aria-hidden="true"><span /><span /><span /><span /></div>
      <section className="hero">
        <div className="ornament ornament-top" aria-hidden="true" />
        <div className="hero-arch" aria-hidden="true">
          <div className="arch-door arch-left" />
          <div className="arch-door arch-right" />
          <div className="arch-line" />
        </div>
        <div className="hero-content">
          <p className="kicker">НИКАХ</p>
          <h1>{event.couple}</h1>
          <p className="basmala">{event.basmala}</p>
          <div className="date-place">{event.dateDisplay}</div>
          <button className="gold-button" type="button" onClick={() => setOpened(true)}>Открыть приглашение</button>
        </div>
        <div className="ornament ornament-bottom" aria-hidden="true" />
      </section>

      <div className="content" aria-hidden={!opened}>
        <section className="section guest-card reveal">
          <p className="eyebrow">Персональное приглашение</p>
          <h2>{dynamicGuest ? `${greeting(dynamicGuest)} ${dynamicGuest}!` : "Дорогие гости!"}</h2>
          <p>{event.guestText}</p>
        </section>
        <section className="section reveal">
          <p className="eyebrow">С любовью и уважением</p>
          <h2>Приглашение на никах</h2>
          <p className="lead">{event.invitationText}</p>
        </section>
        <section className="section date-section reveal">
          <p className="eyebrow">Дата торжества</p>
          <div className="large-date">{event.dateDisplay}</div>
          <div className="large-time">{event.timeDisplay}</div>
        </section>
        <section className="section reveal">
          <p className="eyebrow">До встречи осталось</p>
          <div className="countdown">
            {[
              ["Дни", countdown.days],
              ["Часы", countdown.hours],
              ["Минуты", countdown.minutes],
              ["Секунды", countdown.seconds],
            ].map(([label, value]) => (
              <div key={label}><strong>{String(value).padStart(2, "0")}</strong><span>{label}</span></div>
            ))}
          </div>
        </section>
        <section className="section venue reveal">
          <p className="eyebrow">Место проведения</p>
          <h2>{event.venue.name}</h2>
          <p>{event.venue.address}</p>
          <p className="venue-time">{event.venue.time}</p>
          <a className="outline-button" href={event.venue.mapUrl} target="_blank" rel="noreferrer">Открыть на карте</a>
        </section>
        <section className="section reveal">
          <p className="eyebrow">Программа дня</p>
          <div className="timeline">
            {event.program.map((item) => (
              <div className="timeline-item" key={item.time + item.title}>
                <time>{item.time}</time><span>{item.title}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="section rsvp reveal">
          <p className="eyebrow">Подтверждение</p>
          <h2>Будете ли вы с нами?</h2>
          <div className="rsvp-actions">
            <button className="gold-button" type="button" onClick={() => saveRsvp("Спасибо, будем ждать Вас!")}>С радостью приду</button>
            <button className="quiet-button" type="button" onClick={() => saveRsvp("Спасибо, что сообщили нам.")}>К сожалению, не смогу</button>
          </div>
          <p className="rsvp-result">{rsvp || "Ответ сохранится на этом устройстве."}</p>
        </section>
      </div>
      <button className={musicOn ? "music-pill playing" : "music-pill"} type="button" onClick={() => setMusicOn(!musicOn)}>
        {musicOn ? <Pause size={15} /> : <Music2 size={15} />}
        <span>{musicOn ? "Выключить музыку" : "Включить музыку"}</span>
      </button>
    </main>
  );
}

function AdminPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [copied, setCopied] = useState("");
  const base = window.location.origin;
  const guests = Object.entries(event.guests);
  const customSlug = slugify(slug || name);
  const customUrl = customSlug ? `${base}/invite/${customSlug}` : "";

  async function copy(value) {
    await navigator.clipboard.writeText(value);
    setCopied(value);
    window.setTimeout(() => setCopied(""), 1400);
  }

  return (
    <main className="admin-dashboard">
      <header className="admin-header">
        <div><p className="eyebrow">Админ-панель</p><h1>Ссылки гостей</h1></div>
        <a className="outline-button" href="/">Приглашение</a>
      </header>
      <section className="stats-grid">
        <div><strong>{guests.length}</strong><span>Готовых ссылок</span></div>
        <div><strong>0</strong><span>Придут</span></div>
        <div><strong>0</strong><span>Не придут</span></div>
        <div><strong>{guests.length}</strong><span>Не ответили</span></div>
      </section>
      <section className="admin-create">
        <label><span>Имя гостя</span><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Азат и Алия" /></label>
        <label><span>Ссылка</span><input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="azat-aliya" /></label>
        <button className="gold-button" disabled={!customUrl} onClick={() => copy(customUrl)}>Скопировать новую</button>
      </section>
      <section className="table-wrap">
        <table>
          <thead><tr><th>Имя</th><th>Ссылка</th><th></th></tr></thead>
          <tbody>
            {guests.map(([key, guestName]) => {
              const url = `${base}/invite/${key}`;
              return <tr key={key}><td>{guestName}</td><td><a className="admin-link" href={url}>{url}</a></td><td><button className="copy-button" onClick={() => copy(url)}>{copied === url ? "Скопировано" : "Скопировать"}</button></td></tr>;
            })}
            {customUrl && <tr><td>{name}</td><td><a className="admin-link" href={customUrl}>{customUrl}</a></td><td><button className="copy-button" onClick={() => copy(customUrl)}>{copied === customUrl ? "Скопировано" : "Скопировать"}</button></td></tr>}
          </tbody>
        </table>
      </section>
    </main>
  );
}

function App() {
  return window.location.pathname.startsWith("/admin") ? <AdminPage /> : <InvitePage />;
}

createRoot(document.getElementById("root")).render(<App />);
