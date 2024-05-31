import {useEffect, useState} from "react"
import {NavBar} from "../components/NavBar"
import {Booking} from "../Types/Booking"
import "./styles/Personnes.css";

export const Locations = () => {
    const [bookings, setBookings] = useState<Array<Booking>>([]);
    const [bookingsEl, setBookingsEl] = useState<Array<JSX.Element>>([]);
    useEffect(() => {
        console.log("useEffect")
        Promise.all([
            buildBookings(),
        ])

    }, [])

    const fetchAllLocations = async (): Promise<Array<Booking>> => {
        const user = localStorage.getItem("user");
        if (user === null) {
            return [];
        }
        const userObj = JSON.parse(user);

        const res = await fetch(`http://localhost:8083/Booking/tenant/${userObj.id}`)
        if (res.status !== 200)
            return [];
        return await res.json();
    }

    const buildBookings = async () => {

        const locations = await fetchAllLocations();
        const mappedLogements = await Promise.all(locations.map(async (booking, index) => {
            const houseRes = await fetch(`http://localhost:8081/House/${booking.houseId}`)
            const house = await houseRes.json();
            return buildPersonDiv(booking, index, house.location);
        }));
        console.log("mappedLogements", mappedLogements)
        setBookingsEl(mappedLogements);
        console.log("bookingsEl", bookingsEl)
    }

    const buildPersonDiv = (booking: Booking, index: number, houseCity: string) => {
        return (
            <div key={booking.id} style={{display: "flex", justifyContent:"space-evenly", gap: "3rem", padding:"1rem"}}>
                <div style={{width:"8rem"}}>
                    <span>{booking.startDate}</span>
                </div>
                <div style={{width:"8rem"}}>
                    <span>{booking.endDate}</span>
                </div>
                <div style={{width:"8rem"}}>
                    <span>{houseCity}</span>
                </div>
                <div style={{width:"8rem"}}>
                    <span>{booking.houseId}</span>
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
                            <span>From</span>
                        </div>
                        <div style={{width:"8rem"}}>
                            <span>Until</span>
                        </div>
                        <div style={{width:"8rem"}}>
                            <span>City</span>
                        </div>
                        <div style={{width:"8rem"}}>
                            <span>House number</span>
                        </div>
                    </div>
                    {bookingsEl ? bookingsEl : <></>}
                </div>
            </div>
        </>

    )
}