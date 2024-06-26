import {useEffect, useState} from "react"
import {NavBar} from "../components/NavBar"
import {Booking} from "../Types/Booking"
import "./styles/Personnes.css";
import {Logement} from "../Types/Logement";

export const Visites = () => {
    const [bookings, setBookings] = useState<Array<Booking>>([]);
    const [bookingsEl, setBookingsEl] = useState<Array<JSX.Element>>([]);
    useEffect(() => {
        console.log("useEffect")
        Promise.all([
            buildBookings(),
        ])

    }, [])

    const fetchAllHousesOfUser = async (): Promise<Array<Logement>> => {
        const user = localStorage.getItem("user");
        if (user === null) {
            return [];
        }
        const userObj = JSON.parse(user);

        const res = await fetch(`http://localhost:8081/House/owner/${userObj.id}`)
        if (res.status !== 200)
            return [];
        return await res.json();
    }

    const buildBookings = async () => {

        const maisons = await fetchAllHousesOfUser();
        const mappedLogements = await Promise.all(maisons.map(async (house, index) => {
            return buildPersonDiv(house);
        }));
        setBookingsEl(mappedLogements);
    }

    const buildPersonDiv = (house: Logement) => {
        return (
            <div key={house.id} style={{display: "flex", justifyContent:"space-evenly", gap: "3rem", padding:"1rem"}}>
                <div style={{width:"8rem"}}>
                    <span>{house.id}</span>
                </div>
                <div style={{width:"8rem"}}>
                    <span>{house.budget}€</span>
                </div>
                <div style={{width:"8rem"}}>
                    <span>{house.location}</span>
                </div>
            </div>
        )
    }



    return (
        <>
            <NavBar />
            <div style={{display: "flex", justifyContent: "center", margin: "1rem 3rem"}}>
                <div style={{border: "1px solid #FFF", borderRadius:"8px"}}>
                    <div style={{display: "flex", justifyContent:"space-evenly", gap: "3rem", padding:"1rem", borderBottom : "1px solid #FFF"}}>
                        <div style={{width:"8rem"}}>
                            <span>House number</span>
                        </div>
                        <div style={{width:"8rem"}}>
                            <span>Price per night</span>
                        </div>
                        <div style={{width:"8rem"}}>
                            <span>City</span>
                        </div>
                    </div>
                    {bookingsEl ? bookingsEl : <></>}
                </div>
            </div>
        </>

    )
}