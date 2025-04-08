import moment from "moment";

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const addThousandsSeparator = (num) => {
    if (num == null || isNaN(num)) return "";

    const [integerPart, fractionalPart] = num.toString().split(".");
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return fractionalPart
    ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger;
};

export const prepareExpenseBarChartData = (data = []) => {
    const chartData = data.map((item) => ({
        category: item?.category,
        amount: item?.amount,
    }));

    return chartData;
};

export const prepareIncomeBarChartData = (data = []) => {
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date)); //[...data]  este o copie superficială (shallow copy) a array-ului data. Se face astfel pentru a nu modifica array-ul original atunci când îl sortezi sau îl modifici ulterior.

    const chartData = sortedData.map((item) => ({ //.map parcurge fiecare obiect si creaza unul nou 
        month: moment(item?.date).format('Do MM'),
        amount: item?.amount,
        source: item?.source,
    }));

    return chartData;
};