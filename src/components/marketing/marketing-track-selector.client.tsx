"use client";

import { useState } from "react";
import {
  Award,
  CheckCircle,
  FileText,
  Laptop,
  MessageSquare,
  Target,
  Video,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MARKETING_PAGE } from "@/constants/marketing.constants";
import { cn } from "@/lib/utils";

const trackSection = MARKETING_PAGE.trackSelector;

const TRACK_ICONS = {
  profile: Target,
  proposals: FileText,
  interviews: MessageSquare,
  operations: Laptop,
} as const;

const FORMAT_ICONS = [Video, FileText, CheckCircle, Award] as const;

type TrackKey = keyof typeof trackSection.tracks;

export function MarketingTrackSelectorClient() {
  const [selectedTrack, setSelectedTrack] = useState<TrackKey>("profile");
  const trackInfo = trackSection.tracks[selectedTrack];
  const TrackIcon = TRACK_ICONS[selectedTrack];

  const trackEntries = Object.entries(trackSection.tracks) as [
    TrackKey,
    (typeof trackSection.tracks)[TrackKey],
  ][];

  return (
    <section
      id="roi-calculator"
      className="relative z-10 border-b-2 border-foreground bg-secondary/15 py-10 sm:pb-24 overflow-hidden font-sans md:py-12"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-8 max-w-3xl space-y-4 text-center sm:mb-16">
          <Badge
            variant="outline"
            className="border-primary/40 bg-primary/10 text-primary font-mono px-3 py-1 font-bold uppercase tracking-wider text-[9px] md:text-[10px]"
          >
            {trackSection.badge}
          </Badge>
          <h2 className="text-xl font-black leading-tight text-foreground sm:text-4xl md:text-5xl tracking-tight">
            {trackSection.title}
          </h2>
          <p className="mx-auto max-w-2xl text-sm font-semibold text-muted-foreground leading-relaxed">
            {trackSection.description}
          </p>
        </div>

        {/* Mobile layout */}
        <div className="space-y-4 md:hidden">
          <div className="overflow-hidden rounded-xl border-2 border-foreground bg-card shadow-[2px_2px_0px_0px_var(--foreground)]">
            <p className="border-b-2 border-foreground bg-secondary/80 px-3 py-2 font-mono text-[9px] font-black uppercase tracking-wider text-primary">
              {trackSection.selectStep}
            </p>
            {trackEntries.map(([key, item], index) => {
              const Icon = TRACK_ICONS[key];
              const isActive = selectedTrack === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedTrack(key)}
                  className={cn(
                    "flex min-h-11 w-full items-center gap-3 px-3 py-2 text-left transition-colors active:opacity-80",
                    index < trackEntries.length - 1 &&
                      "border-b-2 border-foreground",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-foreground",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4 shrink-0 stroke-[2.5]",
                      isActive ? "text-primary-foreground" : "text-primary",
                    )}
                  />
                  <span className="text-xs font-black uppercase tracking-tight">
                    {item.title}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="overflow-hidden rounded-xl border-2 border-foreground bg-card shadow-[2px_2px_0px_0px_var(--foreground)]">
            <div className="flex min-h-11 items-center gap-2 border-b-2 border-foreground bg-secondary/80 px-3 py-2">
              <TrackIcon className="size-4 shrink-0 text-primary" />
              <span className="text-sm font-black text-foreground">
                {trackInfo.title}
              </span>
            </div>

            <div className="border-b-2 border-foreground px-3 py-2.5">
              <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                {trackSection.focusLabel}
              </p>
              <p className="mt-1 text-sm font-black leading-snug text-foreground">
                {trackInfo.focus}
              </p>
            </div>

            <div className="border-b-2 border-foreground px-3 py-2.5">
              <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-primary">
                {trackSection.outputLabel}
              </p>
              <p className="mt-1 text-xs font-semibold leading-relaxed text-foreground/80">
                {trackInfo.output}
              </p>
            </div>

            <div className="flex min-h-11 items-center justify-between gap-3 border-b-2 border-foreground px-3 py-2">
              <span className="font-mono text-[9px] font-bold uppercase text-muted-foreground">
                {trackSection.accessLabel}
              </span>
              <span className="text-xs font-black text-foreground">
                {trackSection.accessValue}
              </span>
            </div>

            <div className="flex min-h-11 items-center justify-between gap-3 px-3 py-2">
              <span className="font-mono text-[9px] font-bold uppercase text-primary">
                {trackSection.progressLabel}
              </span>
              <span className="text-xs font-black text-primary">
                {trackSection.progressValue}
              </span>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border-2 border-foreground bg-card shadow-[2px_2px_0px_0px_var(--foreground)]">
            <p className="border-b-2 border-foreground bg-secondary/80 px-3 py-2 font-mono text-[9px] font-black uppercase tracking-wider text-muted-foreground">
              {trackSection.formatTitle}
            </p>
            {trackSection.formatItems.map((item, index) => {
              const Icon = FORMAT_ICONS[index];
              return (
                <div
                  key={item.label}
                  className={cn(
                    "flex min-h-11 items-center gap-3 px-3 py-2",
                    index < trackSection.formatItems.length - 1 &&
                      "border-b-2 border-foreground",
                  )}
                >
                  <Icon className="size-4 shrink-0 text-primary stroke-[2.5]" />
                  <span className="text-xs font-bold text-foreground">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden min-w-0 grid-cols-1 items-stretch gap-6 md:grid lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col justify-between space-y-6 rounded-2xl border-2 border-foreground bg-card p-8 shadow-[4px_4px_0px_0px_var(--foreground)] lg:col-span-5 select-none">
            <div>
              <h3 className="font-mono text-xs font-black uppercase tracking-wider text-primary">
                {trackSection.selectStep}
              </h3>

              <div className="mt-4 space-y-2.5">
                <label className="text-[10px] font-mono text-muted-foreground uppercase font-bold tracking-wider">
                  {trackSection.selectLabel}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {trackEntries.map(([key, item]) => {
                    const Icon = TRACK_ICONS[key];
                    const isActive = selectedTrack === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedTrack(key)}
                        className={`group flex flex-col justify-between gap-3 rounded-xl border-2 p-3.5 text-left transition-all cursor-pointer ${
                          isActive
                            ? "bg-primary text-primary-foreground border-foreground shadow-[3px_3px_0px_0px_var(--foreground)] -translate-x-0.5 -translate-y-0.5"
                            : "bg-background border-foreground/30 text-muted-foreground hover:border-foreground/60 hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <div
                          className={`w-fit mx-auto p-1.5 rounded-lg border-2 inline-flex ${
                            isActive
                              ? "border-primary-foreground/35 bg-primary-foreground/10 text-primary-foreground"
                              : "border-foreground/10 bg-muted text-muted-foreground group-hover:border-foreground/30 group-hover:text-foreground"
                          }`}
                        >
                          <Icon className="h-4 w-4 shrink-0 stroke-[2.5]" />
                        </div>
                        <span className="text-[12px] font-black leading-tight tracking-tight uppercase text-center">
                          {item.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="rounded-xl border-2 border-foreground bg-background p-4 mt-6">
              <p className="text-[10px] font-mono uppercase font-bold tracking-wider text-muted-foreground">
                {trackSection.formatTitle}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-[11px] font-bold text-foreground">
                {trackSection.formatItems.map((item, index) => {
                  const Icon = FORMAT_ICONS[index];
                  const tone =
                    index === 0
                      ? "bg-primary/10 text-primary"
                      : index === 1
                        ? "bg-secondary text-foreground"
                        : index === 2
                          ? "bg-accent text-accent-foreground"
                          : "bg-primary/20 text-primary";
                  return (
                    <span
                      key={item.label}
                      className="inline-flex items-center gap-2 hover:translate-x-0.5 transition-transform"
                    >
                      <span
                        className={`p-1 rounded-md border-2 border-foreground ${tone}`}
                      >
                        <Icon className="h-3 w-3 stroke-[2.5]" />
                      </span>
                      {item.label}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="relative min-w-0 lg:col-span-7 flex flex-col justify-stretch">
            <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-primary to-secondary opacity-15 blur-xl -z-10" />

            <div className="relative h-full flex flex-col justify-between space-y-6 overflow-hidden rounded-2xl border-2 border-foreground bg-background p-8 shadow-[8px_8px_0px_0px_var(--foreground)] select-none">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card border-2 border-foreground p-4.5 rounded-xl shadow-[3px_3px_0px_0px_var(--foreground)] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_0px_var(--foreground)]">
                  <p className="text-[10px] font-mono text-muted-foreground uppercase font-black tracking-wider">
                    {trackSection.selectedRoute}
                  </p>
                  <h4 className="text-xl font-black text-foreground mt-1 flex items-center gap-2">
                    <span className="size-2 rounded-full bg-primary animate-pulse" />
                    {trackInfo.title}
                  </h4>
                </div>
                <div className="bg-primary/5 border-2 border-primary/30 p-4.5 rounded-xl shadow-[3px_3px_0px_0px_var(--primary)] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_0px_var(--primary)]">
                  <p className="text-[10px] font-mono text-primary uppercase font-black tracking-wider">
                    {trackSection.commercialModel}
                  </p>
                  <h4 className="text-xl font-black text-primary mt-1">
                    {trackSection.payPerCourse}
                  </h4>
                </div>
              </div>

              <div className="bg-muted border-2 border-foreground p-5 rounded-xl shadow-[4px_4px_0px_0px_var(--foreground)] flex-1 flex flex-col justify-center">
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase font-black tracking-wider">
                    {trackSection.focusLabel}
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-foreground leading-snug tracking-tight flex items-start gap-2">
                    <TrackIcon className="size-5 shrink-0 text-primary mt-0.5" />
                    {trackInfo.focus}
                  </h3>
                  <div className="mt-4 border-t-2 border-dotted border-foreground/20 pt-4">
                    <p className="text-[10px] font-mono text-primary uppercase font-black tracking-wider">
                      {trackSection.outputLabel}
                    </p>
                    <p className="text-xs text-foreground/80 mt-1.5 font-semibold leading-relaxed">
                      {trackInfo.output}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t-2 border-foreground pt-4">
                <div className="flex flex-row items-center justify-between gap-3 rounded-lg border-2 border-foreground bg-card p-3 shadow-[2px_2px_0px_0px_var(--foreground)]">
                  <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">
                    {trackSection.accessLabel}
                  </span>
                  <span className="text-xs font-black text-foreground bg-secondary px-2.5 py-0.5 rounded border border-foreground shadow-[1px_1px_0px_0px_var(--foreground)]">
                    {trackSection.accessValue}
                  </span>
                </div>
                <div className="flex flex-row items-center justify-between gap-3 rounded-lg border-2 border-primary bg-primary/10 p-3 shadow-[2px_2px_0px_0px_var(--primary)]">
                  <span className="text-[10px] font-mono font-bold text-primary uppercase">
                    {trackSection.progressLabel}
                  </span>
                  <span className="text-xs font-black text-primary bg-background px-2.5 py-0.5 rounded border border-primary shadow-[1px_1px_0px_0px_var(--primary)]">
                    {trackSection.progressValue}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
