"use client"

import { Download, FileText, TrendingUp, Users, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

const CATEGORY_STATS = [
  { name: "Chanteur", candidatures: 342 },
  { name: "Danse", candidatures: 285 },
  { name: "Slammer", candidatures: 198 },
  { name: "Styliste", candidatures: 176 },
  { name: "Th\u00e9\u00e2tre", candidatures: 158 },
  { name: "Plasticien", candidatures: 125 },
]

const REPORTS = [
  { name: "Rapport global des candidatures", date: "G\u00e9n\u00e9r\u00e9 le 01 Mars 2026", icon: FileText },
  { name: "Statistiques par cat\u00e9gorie", date: "G\u00e9n\u00e9r\u00e9 le 28 F\u00e9vrier 2026", icon: Tag },
  { name: "\u00c9volution des inscriptions", date: "G\u00e9n\u00e9r\u00e9 le 25 F\u00e9vrier 2026", icon: TrendingUp },
  { name: "Profils des candidats approuv\u00e9s", date: "G\u00e9n\u00e9r\u00e9 le 20 F\u00e9vrier 2026", icon: Users },
]

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Rapports</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {"Analyses et rapports de performance du casting"}
        </p>
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">
          {"Candidatures par cat\u00e9gorie"}
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={CATEGORY_STATS}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3d3425" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#a0946e", fontSize: 12 }}
                axisLine={{ stroke: "#3d3425" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#a0946e", fontSize: 12 }}
                axisLine={{ stroke: "#3d3425" }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1610",
                  border: "1px solid #3d3425",
                  borderRadius: "8px",
                  color: "#f5f0e8",
                }}
              />
              <Bar dataKey="candidatures" fill="#d4a017" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Downloadable reports */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-foreground">
          {"Rapports t\u00e9l\u00e9chargeables"}
        </h2>
        {REPORTS.map((report, i) => {
          const Icon = report.icon
          return (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-foreground font-medium text-sm">{report.name}</p>
                  <p className="text-muted-foreground text-xs">{report.date}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-border text-muted-foreground hover:text-primary hover:border-primary"
              >
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
