import Label from "../components/Label";
import judges from "../judges.json";
import {useState} from "react";

const demoLabels = {
    "asian": "Asian American",
    "hispaniclatino": "Hispanic or Latino",
    "black": "Black",
    "nativeamer": "Native American",
    "mena": "Middle Eastern or North African",
};

const filterLabels = {
    all: "All (66)",
    responded: "Responded (28)",
    none: "No response (33)",
    declined: "Declined to respond (5)",
}

export default function Home() {
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");

    const filteredJudges = judges.filter(d => {
        if (filter === "all") return true;
        if (filter === "responded") return d.responded;
        if (filter === "none") return !d.responded && !d.declined;
        if (filter === "declined") return d.declined;
    }).filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="max-w-3xl mx-auto px-4">
            <h1 className="text-2xl font-bold mb-8">All award judges</h1>
            <Label>Filter by</Label>
            <div className="overflow-x-auto">
                <div className="flex my-4">
                    {Object.keys(filterLabels).map(option => (
                        <button
                            className={`px-3 mr-2 py-1 rounded-full text-sm whitespace-nowrap ${option === filter ? "text-white bg-brand" : "border"}`}
                            key={option}
                            onClick={() => setFilter(option)}
                        >{filterLabels[option]}</button>
                    ))}
                    <input type="text" placeholder="Search by name" className="border-b px-2 py-1 w-40" value={search}
                           onChange={e => setSearch(e.target.value)}/>
                </div>
            </div>
            <div className="flex mt-12 mb-2">
                <Label className="w-48 xs:w-72 flex-shrink-0">Name</Label>
                <Label className="w-32 ml-4 hidden sm:block">Award</Label>
                <Label className="ml-4">Race/ethnicity</Label>
            </div>
            {filteredJudges.map(judge => (
                <div className="flex border-b py-3 hover:bg-gray-100 px-4 -mx-4" key={judge.name + judge.award}>
                    <div className="w-48 xs:w-72">
                        <p>{judge.name}</p>
                        <p className="opacity-50 truncate text-sm hidden sm:block">{judge.title || ""}{judge.title && judge.organization && ", "}{judge.organization || ""}</p>
                        <p className="opacity-50 truncate text-sm sm:hidden">{judge.award.join(", ")} judge</p>
                    </div>
                    <div className="w-32 ml-4 hidden sm:block flex-shrink-0">
                        <p>{judge.award.join(", ")}</p>
                    </div>
                    <div className="ml-4">
                        <p>{(d => {
                            if (!d.responded && !d.source) return "Unknown"
                            let races = [];
                            for (let label of Object.keys(demoLabels)) {
                                if (d[label]) races.push(demoLabels[label]);
                            }
                            if (!races.length) races.push("White");
                            let raceText = races.join(", ");
                            return races.join(", ");
                        })(judge)}</p>
                        <p className="text-sm opacity-50">{(d => {
                            if (d.source) return (
                                <a href={d.source} className="underline" target="__blank">Source</a>
                            )

                            if (d.responded) return "Responded to Voices";

                            if (d.declined) return "Declined to respond";

                            return "No response";
                        })(judge)}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}