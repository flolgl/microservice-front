import {ChangeEvent, FormEvent, useEffect, useState} from "react"
import {NavBar} from "../components/NavBar"
import "./styles/Personnes.css";
import {Logement} from "../Types/Logement";

export const AddHouse = () => {
    const [typesToDisplay, setTypesToDisplay] = useState<Array<string>>([]);
    const [city, setCity] = useState<string>("");
    const [price, setPrice] = useState<number>(0);
    const [type, setType] = useState<string>("");

    const fetchAllMaisonTypes = () => {
        return fetch("http://localhost:8081/House/Types")
            .then(res => res.json())
            .then((types: Array<string>) => {
                setTypesToDisplay(types);
            });
    }

    const buildTypesSelect = () => {
        return typesToDisplay.map((type, index) => (
            <option key={index} value={type}>{type}</option>)
        );
    }
    useEffect(() => {
        Promise.all([
            fetchAllMaisonTypes()
        ]);
    }, [])

    function onFormSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const user = localStorage.getItem("user");
        if (user === null) {
            return;
        }
        const logement: Logement = {
            id: -1,
            budget: price+"",
            location: city,
            ownerId: JSON.parse(user).id,
            type: type

        }
        // todo : add validation and logement creation
        const userObj = JSON.parse(user);
        fetch("http://localhost:8081/House", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(logement)
        }).then(res => {
            if (res.status === 201) {
                alert("House created successfully");
            } else {
                alert("Failed to create house");
            }
        })
    }


    function onCityChange(event: ChangeEvent<HTMLInputElement>) {
        setCity(event.target.value)
    }

    function onPriceChange(event: ChangeEvent<HTMLInputElement>) {
        setPrice(parseInt(event.target.value))
    }

    function onSelectHouseTypeChange(event: ChangeEvent<HTMLSelectElement>) {
        setType(event.target.value)
    }

    return (
        <>
            <NavBar />
            <div style={{display: "flex", justifyContent: "center", margin: "1rem 3rem"}}>
                <form onSubmit={onFormSubmit} style={{display: "flex", gap: "1rem", justifyContent: "center", alignItems: "center", flexDirection: "column", padding:"3rem", border: "1px solid #FFF", borderRadius: "8px"}}>
                    <input onChange={onCityChange} type="text" placeholder="City" style={{padding:"0.5rem 0.5rem", border: "1px solid #FFF", borderRadius: "8px", minWidth: "11rem"}}/>
                    <input onChange={onPriceChange} type="number" placeholder="Price per night" style={{padding:"0.5rem 0.5rem", border: "1px solid #FFF", borderRadius: "8px", minWidth: "11rem"}}/>
                    <select onChange={onSelectHouseTypeChange} name="house-type" style={{padding:"0.5rem 0.5rem", border: "1px solid #FFF", borderRadius: "8px", minWidth: "11rem"}}>
                        <option value="">---</option>
                        {typesToDisplay.length > 0 ? buildTypesSelect() : <></>}
                    </select>
                    <button className={"button-job"} style={{minWidth: "11rem"}}>Create a house</button>
                </form>
            </div>
        </>

    )
}