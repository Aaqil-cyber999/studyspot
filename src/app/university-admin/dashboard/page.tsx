"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PageLoader } from "@/components/shared/page-loader";
import { getUaDashboard, getUaComments } from "@/services/university-admin";
import { Building2, Star, MessageSquare, Armchair, Plus, ChevronRight, TrendingUp, Moon, Sun } from "lucide-react";

export default function UaDashboardPage() {
  const { data: dashboard } = useQuery({ queryKey: ["ua", "dashboard"], queryFn: getUaDashboard });
  const { data: comments = [] } = useQuery({ queryKey: ["ua", "comments"], queryFn: getUaComments });
  const [darkMode, setDarkMode] = useState(false);

  if (!dashboard) {
    return <PageLoader className="min-h-screen bg-gradient-to-br from-orange-50/30 to-white py-0" />;
  }

  const stats = [
    { label: "Total Locations", value: dashboard.locations, icon: Building2, gradient: "from-orange-500 to-orange-600", href: "/university-admin/locations" },
    { label: "Avg. Rating", value: dashboard.avgRating.toFixed(1), icon: Star, gradient: "from-amber-500 to-amber-600", href: "/university-admin/locations" },
    { label: "Comments", value: dashboard.comments, icon: MessageSquare, gradient: "from-blue-500 to-blue-600", href: "/university-admin/comments" },
    { label: "Seats Available", value: dashboard.seatsAvailable, icon: Armchair, gradient: "from-emerald-500 to-emerald-600", href: "/university-admin/locations" },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" : "bg-gradient-to-br from-orange-50/40 via-white to-orange-50/20"}`}>
      <div className="mx-auto w-full max-w-[412px] px-4 pb-10 pt-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>Dashboard</h1>
            <p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>University of Moratuwa</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-all hover:scale-105 ${darkMode ? "bg-slate-800/80 text-amber-400 hover:bg-slate-700 backdrop-blur" : "bg-white/80 text-slate-600 shadow-md shadow-slate-200/50 hover:shadow-lg backdrop-blur"}`}
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link href="/university-admin/profile" className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#f97316] to-orange-600 shadow-lg shadow-orange-300/40 ring-2 ring-white/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-orange-400/50">
              <span className="text-sm font-semibold text-white">UM</span>
            </Link>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.label}
                href={stat.href}
                className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1 ${darkMode ? "border-slate-800/80 bg-gradient-to-br from-slate-900/80 to-slate-900/40 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-orange-950/30" : "border-slate-200/60 bg-gradient-to-br from-white to-slate-50/30 shadow-lg shadow-slate-200/40 hover:shadow-xl hover:shadow-orange-100/60"}`}
              >
                <div className={`absolute -right-2 -top-2 h-12 w-12 rounded-full bg-gradient-to-br ${stat.gradient} opacity-10 blur-2xl`} />
                <div className={`relative mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-md transition-transform group-hover:scale-110`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="relative">
                  <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>{stat.value}</p>
                  <p className={`mt-0.5 text-xs font-medium ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{stat.label}</p>
                </div>
                <TrendingUp className={`absolute bottom-3 right-3 h-4 w-4 transition-all group-hover:translate-x-0.5 ${darkMode ? "text-slate-600 group-hover:text-orange-400" : "text-slate-300 group-hover:text-[#f97316]"}`} />
              </Link>
            );
          })}
        </div>

        <div className={`mb-6 overflow-hidden rounded-2xl border shadow-lg ${darkMode ? "border-slate-800 bg-slate-900/50 shadow-slate-900/50" : "border-white/60 bg-white shadow-orange-100/40"}`}>
          <div className={`flex items-center justify-between px-4 py-3 ${darkMode ? "bg-gradient-to-r from-slate-800 to-slate-900/50" : "bg-gradient-to-r from-orange-50 to-white"}`}>
            <div>
              <h2 className={`text-sm font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>Recent Feedback</h2>
              <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Latest from your locations</p>
            </div>
            <Link href="/university-admin/comments" className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${darkMode ? "bg-[#f97316]/20 text-orange-400 hover:bg-[#f97316]/30" : "bg-[#f97316]/10 text-[#f97316] hover:bg-[#f97316]/20"}`}>
              View all
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="p-4">
            {comments.length === 0 ? (
              <div className={`flex h-24 items-center justify-center rounded-xl border border-dashed text-sm ${darkMode ? "border-slate-700 text-slate-500" : "border-slate-200 text-slate-400"}`}>
                No comments yet
              </div>
            ) : (
              <div className="space-y-3">
                {comments.slice(0, 2).map((comment) => (
                  <div key={comment.id} className={`rounded-xl border p-3 shadow-sm ${darkMode ? "border-slate-700 bg-slate-800/50" : "border-slate-100 bg-gradient-to-br from-white to-slate-50/30"}`}>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${i < Math.round(comment.rating) ? "fill-amber-400 text-amber-400" : darkMode ? "fill-slate-700 text-slate-700" : "fill-slate-200 text-slate-200"}`}
                          />
                        ))}
                        <span className={`ml-1 text-xs font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>{comment.rating.toFixed(1)}</span>
                      </div>
                      <span className={`text-[11px] ${darkMode ? "text-slate-500" : "text-slate-400"}`}>{comment.createdAt}</span>
                    </div>
                    <p className={`text-sm leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-700"}`}>&ldquo;{comment.text}&rdquo;</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#f97316]" />
                      <p className={`text-xs font-medium ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{comment.locationName}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br from-[#f97316] to-orange-600 shadow-xl shadow-orange-200/60">
          <div className="p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur">
                <Plus className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Quick Actions</h2>
                <p className="text-xs text-orange-100">Add and manage locations</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/university-admin/locations/new"
                className="flex items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-[#f97316] shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                <Plus className="h-4 w-4" />
                Add Location
              </Link>
              <Link
                href="/university-admin/locations"
                className="flex items-center justify-center gap-1.5 rounded-xl bg-white/10 backdrop-blur px-3 py-2 text-sm font-semibold text-white transition-all hover:bg-white/20"
              >
                Manage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
