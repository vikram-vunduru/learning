"use client";

import { useEffect, useState } from "react";
import type { Cert } from "@/lib/tracks";

interface Props {
  certs: Cert[];
  trackId: string;
}

export default function CertTracker({ certs, trackId }: Props) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem(`progress_${trackId}_certs`);
    if (saved) setCompleted(new Set(JSON.parse(saved)));
  }, [trackId]);

  const toggle = (certId: string) => {
    const next = new Set(completed);
    next.has(certId) ? next.delete(certId) : next.add(certId);
    setCompleted(next);
    localStorage.setItem(`progress_${trackId}_certs`, JSON.stringify([...next]));
  };

  const pct = Math.round((completed.size / certs.length) * 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Certification Tracker
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {completed.size} / {certs.length} completed
        </span>
      </div>

      {/* Overall progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Overall progress</span>
          <span>{pct}%</span>
        </div>
        <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {certs.map((cert) => {
          const done = completed.has(cert.id);
          return (
            <div
              key={cert.id}
              onClick={() => toggle(cert.id)}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                done
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-colors ${
                  done
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                {done && <span className="text-xs">✓</span>}
              </div>

              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium truncate ${done ? "line-through text-gray-400" : "text-gray-900 dark:text-white"}`}>
                  {cert.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Month {cert.month} · {cert.questions} Qs · {cert.passScore} pass · {cert.cost}
                </div>
              </div>

              {cert.id === "cta" && (
                <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded-full font-medium">
                  Pinnacle
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
