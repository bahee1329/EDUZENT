import React, {useEffect, useState} from 'react';
import Layout from "../../../layout/layout";
import FeatherIcon from "feather-icons-react";
import {filter, pick, pluck, uniq, values} from "underscore";
import LeaderBoardForm from "./leaderBoardForm";
// import {leaderBoardData} from "./leaderBoardDamidata";
import {toggleConfirmationDialog, toggleLoader} from "../../../redux/actions";
import axios from 'axios';
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {filterDataByKey, rankMarks} from '../../../utils/utils';
import {isAdminAccount} from "../../../utils/Authentication";

export default function LeaderBoard(props) {
    const [leaderBoardList, setLeaderBoardList] = useState([])
    const [leaderBoardAllList, setLeaderBoardAllList] = useState([])
    const [modalType, setModalType] = useState("view")
    const [modalShow, setModalShow] = useState(false);
    const [deletedId, setDeletedId] = useState(null);
    const [update, setUpdate] = useState(false);
    const [selectedLeaderBoard, setSelectedLeaderBoard] = useState({})


    const confirmationDialog = useSelector(state => {
        return state.setting.confirmationDialog
    });

    function handleDelete(id) {
        dispatch(toggleConfirmationDialog({
            isVisible: true,
            confirmationHeading: ('ARE YOU SURE YOU WANT TO DELETE THIS STUDENT DATA'),
            confirmationDescription: ('THE DELETE ACTION WILL REMOVE THE THIS STUDENT DATA')
        }));
        setDeletedId(id)
        console.log("ads")
    }

    const dispatch = useDispatch();

    useEffect(() => {
        if (!confirmationDialog || !confirmationDialog.onSuccess || !deletedId) {
            console.log("asdf")
            return;
        }
        console.log("asdasd")
        dispatch(toggleLoader(true))

        //hhttp://localhost:5000/api/leaderBoard/:id
        axios.delete(`${process.env.REACT_APP_HOST}/leaderBoard/${deletedId}`)
            .then((res) => {
                setUpdate(!update)
                toast.success(`Successfully Deleted`)

            }).catch((err) => {
            console.log(err)
        }).finally(() => {
            dispatch(toggleLoader(false))
            setDeletedId(null)
        })
    }, [confirmationDialog])

    function handleSearch(e) {
        let val = e.target.value;
        if (val !== "") {
            let res = filter(leaderBoardAllList, function (item) {
                return values(pick(item, 'regNo', 'name', 'instituteName', 'subject', 'marks', 'rank')).toString().toLocaleLowerCase().includes(val.toLocaleLowerCase());
            });
            setLeaderBoardList(res);
            console.log(res)
        } else {
            setLeaderBoardList(leaderBoardAllList);
        }
    }

    useEffect(() => {
        dispatch(toggleLoader(true));
        axios.get(`${process.env.REACT_APP_HOST}/getAllLeaderBoards`)
            .then((res) => {
                let rankedData = rankMarks(res.data, "rank")
                setLeaderBoardList(rankedData);
                setLeaderBoardAllList(rankedData);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                dispatch(toggleLoader(false));
            });
    }, [update]);


    return (
        <Layout>
            <div className={"container"}>
                <div className={"container-widget"}>
                    <div className={"students_marks_container"}>
                        <div><h3 className={"content-heading"}>Leader Board</h3></div>
                        <div className={"table-btn-container d-flex justify-content-end pb-3"}>

                            <div className={"appointment-search"}>
                                <div className="container-fluid">
                                    <form className="d-flex" role="search">

                                        {/* <button className="btn btn-outline-success" type="submit">Search</button> */}
                                        <input className="form-control me-2" onChange={handleSearch} type="search"
                                               placeholder="Search"
                                               aria-label="Search"/>
                                    </form>
                                </div>
                            </div>
                            <div className={"dropdown"}>
                                <button className={"btn btn-secondary dropdown-toggle marks-dropdown-btn"} type="button"
                                        data-bs-toggle="dropdown" aria-expanded="false">
                                    Subject {/* Change this text to your desired label */}
                                </button>
                                <ul className={"dropdown-menu dropdown-menu-dark"}>
                                    <li><a className={"dropdown-item cursor-pointer"}
                                           onClick={() => setLeaderBoardList(filterDataByKey(leaderBoardAllList, "All"))}>All</a>
                                    </li>
                                    {uniq(pluck(leaderBoardAllList, "subject")).map((item, index) => <li><a
                                        className={"dropdown-item cursor-pointer"} key={index + item}
                                        onClick={() => setLeaderBoardList(filterDataByKey(leaderBoardAllList, item))}>{item.replace("_", " ")}</a>
                                    </li>)}

                                </ul>
                            </div>


                            {isAdminAccount() &&
                                <button type="button" className={"btn btn-secondary students-dropdown-btn"}
                                        onClick={() => {
                                            setModalType("Add");
                                            setModalShow(true)
                                        }}>
                                    <FeatherIcon className={"action-icons text-white"} icon={"plus"}/>
                                    Add
                                </button>}

                        </div>
                    </div>
                    <div className={"table-container"}>
                        <table className={"table table-hover table-striped"}>
                            <thead className={"top-0 position-sticky h-45"}>
                            <tr>
                                <th scope="col">No</th>
                                <th scope="col">Reg.No</th>
                                <th scope="col">Name</th>
                                <th scope="col">Institute Name</th>
                                <th scope="col">Subject</th>
                                <th scope="col">Marks</th>
                                <th scope="col">Rank</th>
                                <th scope="col"></th>
                            </tr>
                            </thead>
                            <tbody>
                            {leaderBoardList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((data, index) => (
                                <tr key={index + "asd"}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{data.regNo}</td>
                                    <td>{data.name}</td>
                                    <td>{data.instituteName}</td>
                                    <td>{data.subject}</td>
                                    <td>{data.marks}</td>
                                    <td>{data.rank}</td>
                                    <td>
                                        <FeatherIcon className={"action-icons"} icon={"edit"}
                                                     onClick={() => {
                                                         setSelectedLeaderBoard(data)
                                                         setModalType("Edit");
                                                         setModalShow(true)
                                                     }}/>

                                        <FeatherIcon className={"action-icons text-red"} icon={"trash-2"}
                                                     onClick={() => handleDelete(data._id)}/>
                                    </td>
                                </tr>))}
                            </tbody>
                        </table>
                        {leaderBoardList.length === 0 &&
                            <div className={"text-center py-5 fw-bold"}>No Leader Board Data Found,Please Add</div>}

                    </div>
                </div>
            </div>

            <LeaderBoardForm
                show={modalShow}
                type={modalType}
                selectedLeaderBoard={selectedLeaderBoard}
                update={() => setUpdate(!update)}
                onHide={() => {
                    setModalShow(false);
                    setSelectedLeaderBoard(null)
                }}
            />

        </Layout>
    )
}

