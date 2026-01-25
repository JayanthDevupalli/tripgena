"use client"

import { useMemo } from "react"
import { Wallet, Utensils, Plane, Bed, Ticket, HelpCircle, AlertTriangle, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

type Category = 'Travel' | 'Stay' | 'Food' | 'Activity' | 'Other'

const categoryConfig: Record<Category, { icon: any, color: string, bg: string }> = {
    Travel: { icon: Plane, color: "text-blue-600", bg: "bg-blue-500" },
    Stay: { icon: Bed, color: "text-purple-600", bg: "bg-purple-500" },
    Food: { icon: Utensils, color: "text-orange-600", bg: "bg-orange-500" },
    Activity: { icon: Ticket, color: "text-emerald-600", bg: "bg-emerald-500" },
    Other: { icon: HelpCircle, color: "text-slate-600", bg: "bg-slate-500" },
}

export function CostBreakdown({ itinerary, totalCost, maxBudget }: { itinerary: any[], totalCost: number, maxBudget?: number }) {

    const stats = useMemo(() => {
        const breakdown: Record<string, number> = { Travel: 0, Stay: 0, Food: 0, Activity: 0, Other: 0 }

        itinerary.forEach((day: any) => {
            day.activities.forEach((act: any) => {
                const type = act.type || 'Other'
                // Normaize type
                const key = Object.keys(breakdown).find(k => k.toLowerCase() === type.toLowerCase()) || 'Other'
                breakdown[key] += (act.cost || 0)
            })
        })
        return breakdown
    }, [itinerary])

    const budgetHealth = maxBudget ? (totalCost / maxBudget) * 100 : 0
    const isOverBudget = maxBudget && totalCost > maxBudget

    return (
        <div className="space-y-6">

            {/* Budget Health Indicator */}
            {maxBudget && (
                <div className={`p-4 rounded-xl border ${isOverBudget ? "bg-red-50 border-red-100" : "bg-emerald-50 border-emerald-100"}`}>
                    <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-bold uppercase tracking-wider ${isOverBudget ? "text-red-700" : "text-emerald-700"}`}>
                            {isOverBudget ? "Over Budget" : "Budget Health"}
                        </span>
                        {isOverBudget ? <AlertTriangle className="w-4 h-4 text-red-600" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <div className="h-2.5 bg-white/50 rounded-full overflow-hidden mb-2">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(budgetHealth, 100)}%` }}
                            className={`h-full rounded-full ${isOverBudget ? "bg-red-500" : "bg-emerald-500"}`}
                        />
                    </div>
                    <div className="flex justify-between text-xs font-medium">
                        <span className={isOverBudget ? "text-red-600" : "text-emerald-700"}>₹{totalCost.toLocaleString()} used</span>
                        <span className="text-slate-400">Limit: ₹{maxBudget.toLocaleString()}</span>
                    </div>
                </div>
            )}

            {/* Category Breakdown */}
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-slate-400" />
                    Expense Distribution
                </h4>
                <div className="space-y-4">
                    {(Object.keys(stats) as Category[]).map((cat) => {
                        const amount = stats[cat]
                        if (amount === 0) return null
                        const percent = (amount / totalCost) * 100
                        const Config = categoryConfig[cat]

                        return (
                            <div key={cat}>
                                <div className="flex justify-between items-center text-xs mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <Config.icon className={`w-3.5 h-3.5 ${Config.color}`} />
                                        <span className="font-medium text-slate-700">{cat}</span>
                                    </div>
                                    <span className="font-bold text-slate-900">₹{amount.toLocaleString()}</span>
                                </div>
                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percent}%` }}
                                        transition={{ duration: 1 }}
                                        className={`h-full ${Config.bg}`}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

        </div>
    )
}
