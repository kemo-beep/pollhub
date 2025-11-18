"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Papa from "papaparse";

interface ContestantResult {
    id: string;
    name: string;
    votes: number;
    percentage: number;
    isWinner: boolean;
}

interface CategoryResult {
    categoryId: string;
    categoryName: string;
    totalVotes: number;
    contestants: ContestantResult[];
}

interface CSVExportProps {
    contestName: string;
    categories: CategoryResult[];
    totalVotes: number;
}

export function CSVExport({ contestName, categories, totalVotes }: CSVExportProps) {
    const exportToCSV = () => {
        // Prepare data for export
        const exportData: any[] = [];

        // Add header row
        exportData.push({
            "Contest Name": contestName,
            "Total Votes": totalVotes,
            "Export Date": new Date().toISOString(),
        });
        exportData.push({}); // Empty row

        // Add results for each category
        categories.forEach((category) => {
            exportData.push({
                "Category": category.categoryName,
                "Total Votes": category.totalVotes,
            });
            exportData.push({
                "Rank": "Rank",
                "Contestant Name": "Contestant Name",
                "Votes": "Votes",
                "Percentage": "Percentage",
                "Winner": "Winner",
            });

            category.contestants.forEach((contestant, index) => {
                exportData.push({
                    "Rank": index + 1,
                    "Contestant Name": contestant.name,
                    "Votes": contestant.votes,
                    "Percentage": `${contestant.percentage.toFixed(2)}%`,
                    "Winner": contestant.isWinner ? "Yes" : "No",
                });
            });

            exportData.push({}); // Empty row between categories
        });

        // Convert to CSV
        const csv = Papa.unparse(exportData, {
            header: true,
            skipEmptyLines: false,
        });

        // Download
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${contestName.replace(/[^a-z0-9]/gi, "_")}_results_${Date.now()}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Button onClick={exportToCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
        </Button>
    );
}

