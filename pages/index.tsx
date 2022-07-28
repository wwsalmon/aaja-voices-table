import Label from "../components/Label";
import judges from "../judges.json";
import {ReactNode, useEffect, useState} from "react";

const demoLabels = {
    "asian": "Asian American",
    "hispaniclatino": "Hispanic or Latino",
    "black": "Black",
    "nativeamer": "Native American",
    "mena": "Middle Eastern",
};

const filterLabels = {
    all: "All (66)",
    responded: "Responded (28)",
    none: "No response (34)",
    declined: "Declined to respond (4)",
}

const enhancedJudges = judges.map(d => {
    let newJudge: {
        name: string,
        title: string,
        organization: string,
        award: string[],
        black: string | number,
        asian: string | number,
        hispaniclatino: string | number,
        nativeamer: string | number,
        mena: string | number,
        responded: string | number,
        declined: string | number,
        source: string,
        responseStatus?: ReactNode,
        raceEthnicity?: string,
        awardString?: string,
    } = {...d};

    newJudge["responseStatus"] = (
        <>
            {d.source && (
                <><a href={d.source} className="underline" target="__blank">Source</a>, </>
            )}
            {d.responded ? "Responded to Voices" : d.declined ? "Declined to respond" : "No response"}
        </>
    );

    newJudge["raceEthnicity"] = (() => {
        if (!d.responded && !d.source) return "Unknown"
        let races = [];
        for (let label of Object.keys(demoLabels)) {
            if (d[label]) races.push(demoLabels[label]);
        }
        if (!races.length) races.push("White");
        return races.join(", ");
    })();

    newJudge["awardString"] = d.award.join(", ");

    return newJudge;
});

export default function Home() {
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [displayJudges, setDisplayJudges] = useState(enhancedJudges);
    const [iter, setIter] = useState(0);
    const [sortBy, setSortBy] = useState("none");

    useEffect(() => {
        setSortBy("none");

        const filteredJudges = enhancedJudges.filter(d => {
            if (filter === "all") return true;
            if (filter === "responded") return d.responded;
            if (filter === "none") return !d.responded && !d.declined;
            if (filter === "declined") return d.declined;
        }).filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

        setDisplayJudges(filteredJudges);
    }, [filter, search]);

    function sortByField(field: string) {
        const sortedJudges = [...displayJudges].sort((a, b) => (b[field] < a[field]) ? (-1)**(iter + 1) : (b[field] > a[field]) ? (-1)**(iter + 2) : 0);
        setDisplayJudges(sortedJudges);
        setIter(prev => (prev + 1) % 2);
        setSortBy(field);
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="sticky top-0 bg-white z-10 px-4 pt-4 border-b border-black">
                <div className="overflow-x-auto">
                    <div className="flex my-4 items-center">
                        <Label className="flex-shrink-0 mr-4">Filter by</Label>
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
                <div className="flex mb-2">
                    <button className="w-48 sm:w-72 flex-shrink-0 text-left" onClick={() => sortByField("name")}>
                        <Label>Name {sortBy === "name" ? iter ? "↓" : "↑" : ""}</Label>
                    </button>
                    <button className="w-32 ml-4 hidden sm:block text-left" onClick={() => sortByField("awardString")}>
                        <Label>Award {sortBy === "awardString" ? iter ? "↓" : "↑" : ""}</Label>
                    </button>
                    <button className="ml-4 text-left" onClick={() => sortByField("raceEthnicity")}>
                        <Label>Race/ethnicity {sortBy === "raceEthnicity" ? iter ? "↓" : "↑" : ""}</Label>
                    </button>
                </div>
            </div>
            <p className="opacity-50 my-2 text-sm px-4">Click on a heading to sort</p>
            {displayJudges.map(judge => (
                <div className="flex border-b py-3 hover:bg-gray-100 px-4" key={judge.name + judge.award}>
                    <div className="w-48 sm:w-72">
                        <p>{judge.name}</p>
                        <p className="opacity-50 truncate text-sm hidden sm:block">{judge.title || ""}{judge.title && judge.organization && ", "}{judge.organization || ""}</p>
                        <p className="opacity-50 truncate text-sm sm:hidden">{judge.awardString} judge</p>
                    </div>
                    <div className="w-32 ml-4 hidden sm:block flex-shrink-0">
                        <p>{judge.award.join(", ")}</p>
                    </div>
                    <div className="ml-4">
                        <p>{judge.raceEthnicity}</p>
                        <p className="text-sm opacity-50">{judge.responseStatus}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}