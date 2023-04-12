import { useRef, useState, useEffect } from "react";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase.js";
import { RingLoader } from "react-spinners";

function App() {
	const counterRef = useRef();
	const [totalCount, setTotalCount] = useState(0);
	const [data, setData] = useState([]);
	const [dataset, setDatset] = useState({});
	const [load, setLoad] = useState(true);
	const [modal, setModal] = useState(false);

	const citiesRef = collection(db, "location");

	useEffect(() => {
		console.log(dataset);
		getDataFromFirebase();
	}, [dataset]);

	/**
	 *
	 * @param {string} IpAddress
	 */
	const cleanIp = (IpAddress) => {
		return IpAddress.split(".").slice(0, 3).join(".");
	};

	async function ipLookUp() {
		try {
            console.log("checking")
			const res = await fetch("https://ipapi.co/json/");
        	    console.log(res);
			if (res.status === 200) {
				const data = await res.json();
				console.log(data);
				const ID = Date.now();
				console.log(ID);
				const _data = dataset[cleanIp(data?.ip)];
				console.log(_data);
				if (_data) {
					_data.counter++;
					setDatset({ ...dataset, [cleanIp(data?.ip)]: _data });
					updateFirebase(
						_data.counter,
						_data.id,
						_data.country,
						_data.city,
						cleanIp(data?.ip),
					);
				} else {
					setDatset({
						...dataset,
						[cleanIp(data?.ip)]: {
							counter: 1,
							city: data?.city,
							country: data?.country_name,
							id: ID.toString(),
						},
					});
					writeToFirebase(
						cleanIp(data?.ip),
						1,
						data?.city,
						data?.country_name,
						ID.toString(),
					);
				}
			}
		} catch (error) {
			console.error(error);
			setLoad(false);
			setModal(true);
		}
	}

	const increaseCounter = () => {
		setLoad(true);
		ipLookUp();
	};

	const writeToFirebase = async (ip, counter, city, country, id) => {
		console.log(id);
		await setDoc(doc(citiesRef, id), {
			IpAddress: ip,
			counter: counter,
			city: city,
			country: country,
		});
	};

	const updateFirebase = async (counter, id, country, city, ip) => {
		setDoc(
			doc(collection(db, "location"), id),
			{
				counter: counter,
				country: country,
				city: city,
				IpAddress: ip,
			},
			{ merge: true },
		);
	};

	const getDataFromFirebase = async () => {
		const querySnapshot = await getDocs(collection(db, "location"));
		let count = 0;
		let dat = [];
		querySnapshot.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			console.log(doc.id, " => ", doc.data());
			count += doc.data().counter;
			dat.push(doc.data());
		});
		setTotalCount(count);
		setData(dat);
		setLoad(false);
	};

	return load ? (
		<div className='center'>
			<RingLoader color='#36d7b7' cssOverride={{}} loading size={100} />
		</div>
	) : (
		<div style={{ position: "relative" }}>
			<h1>
				Counter : <span ref={counterRef}> {totalCount} </span>
			</h1>

			<button
				onClick={increaseCounter}
				style={{ cursor: "pointer", padding: "5px 10px", marginBottom: "20px" }}
			>
				Increase Counter
			</button>

			<table>
				<thead>
					<tr>
						<th>IpAddress</th>
						<th>Counter</th>
						<th>State</th>
						<th>Country</th>
					</tr>
				</thead>

				<tbody>
					{data.map((data) => (
						<tr key={data.id}>
							<td>{data.IpAddress}.XX</td>
							<td>{data.counter}</td>
							<td> {data.city}</td>
							<td> {data.country} </td>
						</tr>
					))}
				</tbody>
			</table>
			

			{modal && (
				<div className='modal'>
					<h1 className='modal-content'>
						Sorry an error occured please refresh the page or try another
						browser
					</h1>
				</div>
			)}
		</div>
	);
}

export default App;
