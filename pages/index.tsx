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
    responded: "Responded (29)",
    none: "No response (34)",
    declined: "Declined to respond (3)",
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
    const [init, setInit] = useState(true);

    useEffect(() => {
        if (init) {
            const sortedJudges = enhancedJudges.sort((a, b) => {
                return b["awardString"]<a["awardString"]?-1:(b["awardString"]>a["awardString"]?1:(a["name"]<b["name"]?-1:1));
            });

            setDisplayJudges(sortedJudges);

            setInit(false);
        } else {
            setSortBy("none");

            const filteredJudges = enhancedJudges.filter(d => {
                if (filter === "all") return true;
                if (filter === "responded") return d.responded;
                if (filter === "none") return !d.responded && !d.declined;
                if (filter === "declined") return d.declined;
            }).filter(d =>
                d.name.toLowerCase().includes(search.toLowerCase()) ||
                d.awardString.toLowerCase().includes(search.toLowerCase()) ||
                d.raceEthnicity.toLowerCase().includes(search.toLowerCase()) ||
                d.organization.toLowerCase().includes(search.toLowerCase()) ||
                d.title.toLowerCase().includes(search.toLowerCase())
            );

            setDisplayJudges(filteredJudges);
        }
    }, [filter, search]);

    function sortByField(field: string) {
        const sortedJudges = [...displayJudges].sort((a, b) => (b[field] < a[field]) ? (-1)**(iter + 1) : (b[field] > a[field]) ? (-1)**(iter + 2) : 0);
        setDisplayJudges(sortedJudges);
        setIter(prev => (prev + 1) % 2);
        setSortBy(field);
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="sticky top-0 bg-white z-10 px-2 pt-2 border-b border-black">
                    <div className="flex mb-4 items-center flex-wrap">
                        <Label className="flex-shrink-0 mr-4">Filter by</Label>
                        {Object.keys(filterLabels).map(option => (
                            <button
                                className={`px-3 mr-2 my-1 py-1 rounded-full text-sm whitespace-nowrap hidden sm:inline-block ${option === filter ? "text-white bg-brand" : "border"}`}
                                key={option}
                                onClick={() => setFilter(option)}
                            >{filterLabels[option]}</button>
                        ))}
                        <select className="sm:hidden block my-2 text-sm p-1 border rounded-full" onChange={e => setFilter(e.target.value)}>
                            {Object.keys(filterLabels).map(option => (
                                <option value={option}>{filterLabels[option]}</option>
                            ))}
                        </select>
                        <input type="text" placeholder="Search by any field" className="border-b px-2 py-1 w-full max-w-[400px] my-1 text-sm sm:text-base" value={search}
                               onChange={e => setSearch(e.target.value)}/>
                    </div>
                <div className="flex mb-2">
                    <button className="w-40 sm:w-72 flex-shrink-0 text-left" onClick={() => sortByField("name")}>
                        <Label>Name {sortBy === "name" ? iter ? "↓" : "↑" : ""}</Label>
                    </button>
                    <button className="w-32 ml-4 hidden xs:block text-left" onClick={() => sortByField("awardString")}>
                        <Label>Award panel {sortBy === "awardString" ? iter ? "↓" : "↑" : ""}</Label>
                    </button>
                    <button className="ml-4 text-left" onClick={() => sortByField("raceEthnicity")}>
                        <Label>Race/ethnicity {sortBy === "raceEthnicity" ? iter ? "↓" : "↑" : ""}</Label>
                    </button>
                </div>
            </div>
            <p className="opacity-50 my-2 text-xs sm:text-sm px-2">Click on a heading to sort</p>
            {displayJudges.map(judge => (
                <div className="flex border-b py-3 hover:bg-gray-100 px-2" key={judge.name + judge.award}>
                    <div className="w-40 sm:w-72 flex-shrink-0">
                        <p className="text-sm sm:text-base">{judge.name}</p>
                        <p className="opacity-50 truncate text-xs sm:text-sm hidden sm:block">{judge.title || ""}{judge.title && judge.organization && ", "}{judge.organization || ""}</p>
                        <p className="opacity-50 truncate text-xs sm:text-sm sm:hidden">{judge.awardString} judge</p>
                    </div>
                    <div className="w-32 ml-4 hidden xs:block flex-shrink-0">
                        <p className="text-sm sm:text-base">{judge.award.join(", ")}</p>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm sm:text-base">{judge.raceEthnicity}</p>
                        <p className="text-xs sm:text-sm opacity-50">{judge.responseStatus}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}