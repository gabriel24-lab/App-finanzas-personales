import React, { useState } from "react";
import { Mail, Clock, MessageSquare } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { PublicPageLayout } from "../components/PublicPageLayout";
import { INFO_PAGE_CONFIG } from "./infoPageConfig";

function SectionBlock({ title, body }) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold tracking-tight text-neutral-900">{title}</h2>
      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-neutral-600">
        {body}
      </p>
    </section>
  );
}

function FaqList({ items }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details
          key={item.q}
          className="group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm open:shadow-md"
        >
          <summary className="cursor-pointer list-none text-sm font-semibold text-neutral-900 marker:content-none">
            <span className="flex items-center justify-between gap-4">
              {item.q}
              <span className="text-neutral-400 transition-transform group-open:rotate-45">+</span>
            </span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

function GuideCards({ guides }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {guides.map((guide) => (
        <article
          key={guide.title}
          className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-brand-700">
            {guide.step}
          </p>
          <h2 className="mt-2 text-base font-bold text-neutral-900">{guide.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">{guide.body}</p>
        </article>
      ))}
    </div>
  );
}

function BlogPosts({ posts }) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <article
          key={post.title}
          className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
        >
          <p className="text-xs font-medium text-neutral-400">{post.date}</p>
          <h2 className="mt-2 text-lg font-bold text-neutral-900">{post.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">{post.excerpt}</p>
          <span className="mt-4 inline-block text-xs font-semibold text-neutral-400">
            {post.tag}
          </span>
        </article>
      ))}
    </div>
  );
}

function ContactPanel({ t, contactEmail }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="space-y-4 lg:col-span-2">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 text-neutral-400" />
            <div>
              <p className="text-sm font-semibold text-neutral-900">{t("info.contact.emailLabel")}</p>
              <a
                href={`mailto:${contactEmail}`}
                className="mt-1 block text-sm text-brand-800 hover:text-brand-950"
              >
                {contactEmail}
              </a>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-5 w-5 text-neutral-400" />
            <div>
              <p className="text-sm font-semibold text-neutral-900">{t("info.contact.hoursLabel")}</p>
              <p className="mt-1 text-sm text-neutral-600">{t("info.contact.hoursValue")}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <MessageSquare className="mt-0.5 h-5 w-5 text-neutral-400" />
            <div>
              <p className="text-sm font-semibold text-neutral-900">{t("info.contact.responseLabel")}</p>
              <p className="mt-1 text-sm text-neutral-600">{t("info.contact.responseValue")}</p>
            </div>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:col-span-3"
      >
        <div>
          <label htmlFor="contact-name" className="text-sm font-semibold text-neutral-800">
            {t("info.contact.form.name")}
          </label>
          <input
            id="contact-name"
            name="name"
            required
            className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 focus:border-brand-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-600/10"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="text-sm font-semibold text-neutral-800">
            {t("info.contact.form.email")}
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 focus:border-brand-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-600/10"
          />
        </div>
        <div>
          <label htmlFor="contact-subject" className="text-sm font-semibold text-neutral-800">
            {t("info.contact.form.subject")}
          </label>
          <input
            id="contact-subject"
            name="subject"
            required
            className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 focus:border-brand-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-600/10"
          />
        </div>
        <div>
          <label htmlFor="contact-message" className="text-sm font-semibold text-neutral-800">
            {t("info.contact.form.message")}
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            className="mt-1.5 w-full resize-y rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 focus:border-brand-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-600/10"
          />
        </div>

        {submitted ? (
          <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {t("info.contact.form.success")}
          </p>
        ) : (
          <button
            type="submit"
            className="inline-flex rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 cursor-pointer"
          >
            {t("info.contact.form.submit")}
          </button>
        )}

        <p className="text-xs text-neutral-400">{t("info.contact.form.note")}</p>
      </form>
    </div>
  );
}

function LegalSections({ sections, updatedAt }) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-medium text-neutral-400">{updatedAt}</p>
      {sections.map((section, index) => (
        <section
          key={section.title}
          className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-base font-bold text-neutral-900">
            {index + 1}. {section.title}
          </h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-neutral-600">
            {section.body}
          </p>
        </section>
      ))}
    </div>
  );
}

export function InfoPage({ slug, onBack }) {
  const { t } = useLanguage();
  const config = INFO_PAGE_CONFIG[slug];

  if (!config) {
    return (
      <PublicPageLayout
        title={t("info.common.notFoundTitle")}
        subtitle={t("info.common.notFoundSubtitle")}
        onBack={onBack}
      />
    );
  }

  const title = t(`info.${slug}.title`);
  const subtitle = t(`info.${slug}.subtitle`);
  const contactEmail = t("info.contact.emailValue");

  let content = null;

  if (config.type === "faq") {
    const items = config.faqKeys.map((key) => ({
      q: t(`info.${slug}.${key}.q`),
      a: t(`info.${slug}.${key}.a`),
    }));
    content = <FaqList items={items} />;
  }

  if (config.type === "sections") {
    const sections = config.sectionKeys.map((key) => ({
      title: t(`info.${slug}.${key}.title`),
      body: t(`info.${slug}.${key}.body`),
    }));
    content = (
      <div className="space-y-4">
        {sections.map((section) => (
          <SectionBlock key={section.title} {...section} />
        ))}
      </div>
    );
  }

  if (config.type === "guides") {
    const guides = config.guideKeys.map((key) => ({
      step: t(`info.${slug}.${key}.step`),
      title: t(`info.${slug}.${key}.title`),
      body: t(`info.${slug}.${key}.body`),
    }));
    content = <GuideCards guides={guides} />;
  }

  if (config.type === "blog") {
    const posts = config.postKeys.map((key) => ({
      date: t(`info.${slug}.${key}.date`),
      title: t(`info.${slug}.${key}.title`),
      excerpt: t(`info.${slug}.${key}.excerpt`),
      tag: t(`info.${slug}.${key}.tag`),
    }));
    content = <BlogPosts posts={posts} />;
  }

  if (config.type === "contact") {
    content = <ContactPanel t={t} contactEmail={contactEmail} />;
  }

  if (config.type === "legal") {
    const sections = config.sectionKeys.map((key) => ({
      title: t(`info.${slug}.${key}.title`),
      body: t(`info.${slug}.${key}.body`),
    }));
    content = (
      <LegalSections sections={sections} updatedAt={t(`info.${slug}.updatedAt`)} />
    );
  }

  return (
    <PublicPageLayout title={title} subtitle={subtitle} onBack={onBack}>
      {content}
    </PublicPageLayout>
  );
}
