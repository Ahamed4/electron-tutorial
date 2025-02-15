import { useEffect, useState } from "react";

export function useStatistics(dataPointNumber: number): Statistics[] {
    const [value, setValue] = useState<Statistics[]>([]);

    useEffect(() => {
    const unsub = window.electron.subscribeStatistics(stats => 
        setValue(prev => {
            const newStats = [...prev,stats];

            if(newStats.length > dataPointNumber) {
                newStats.shift();
            }
            return newStats;
        })
    );

    return unsub;
    },[])

    return value;
}