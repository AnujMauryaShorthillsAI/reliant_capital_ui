export const fetchStates = async (params) => {
    try {
        const response = await fetch(`https://webapp.forecasa.com/api/v1/geo/counties_by_state?`+params);
        const data = await response.json();
        console.log(data);
        return data;   
    } catch (error) {
        console.log(error);
    }
}

export const fetchCompanies = async (params) => {
    try {
        const response = await fetch(`/api/v1/companies?` + params);
        const data = response.json();

        return data;
    } catch (error) {
        console.log(error);
    }
}