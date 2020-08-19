import React from "react";
import {logout, profile, deletePrescription} from "../../services/UserService";
import AdminNavBar from "../../react/AdminNavBar";

export default class PrescriptionRemoveByAdmin extends React.Component {

    state = {
        prescriptions: [],
        profile: {
            username: '',
            userType: '',
            prescriptionId: '',
        }
    }

    componentDidMount() {
        profile()
            .then(profile => this.setState({
                profile: profile,
                prescriptionId: ''
            }))
            .then(this.findAllPrescriptions)
    }

    logout = () => logout()
        .then(status => this.props.history.push("/"))

    findAllPrescriptions = () =>
        fetch("api/prescriptions/find/all")
            .then(response => response.json())
            .then(allPrescriptions => this.setState({
                prescriptions: allPrescriptions
            }))
            .catch(() => console.log("Can’t access response. Blocked by browser?"));


    renderTableData() {
        return this.state.prescriptions.map((prescription, index) => {
            const {id, prescriptionDate, refillData} = prescription //destructuring
            const patientName = prescription.patient.firstName + " " + prescription.patient.lastName
            const doctorName = prescription.doctor.firstName + " " + prescription.doctor.lastName

            return (
                <tr key={id}>
                    <td>{id}</td>
                    <td>{prescriptionDate}</td>
                    <td>{refillData}</td>
                    <td>{doctorName}</td>
                    <td>{patientName}</td>
                </tr>
            )
        })
    }

    deletePrescriptions = () =>
        deletePrescription(this.state.prescriptionId)
            .then(() => {
                alert("Prescription has been removed! Refresh page to see changes :)")
            })

    validateDeletePrescription = () => {
        if (this.state.prescriptionId === '') {
            alert("Prescription ID cannot be empty :(")
            return false
        } else {
            this.deletePrescriptions()
        }
    };

    render() {
        return (
            <div>
                <AdminNavBar/>
                <hr/>
                <div>
                    <h2>PRESCRIPTION INFORMATION</h2>
                    For user: <b>{this.state.profile.username} {this.state.profile.userType}</b>
                    <hr/>
                    <table id='table001'>
                        <tbody>
                        <th>Id</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Doctor</th>
                        <th>Patient Name</th>
                        {this.renderTableData()}
                        </tbody>
                    </table>
                </div>
                <hr/>
                <div>
                    <input
                        value={this.state.prescriptionId}
                        onChange={(e) => this.setState({
                            prescriptionId: e.target.value
                        })}
                        type={"number"}
                        pattern="^[0-9]*$"
                        className={"form-control"}
                        placeholder={"ENTER PRESCRIPTION ID TO REMOVE PRESCRIPTION"}/>
                    <br/>

                    <button
                        // onClick={this.validatePatientProfile}
                        onClick={this.validateDeletePrescription}
                        className="btn btn-primary btn-block">
                        DELETE PRESCRIPTION
                    </button>
                </div>
                <br/>
                <button
                    onClickCapture={this.logout}
                    className={"btn btn-danger"}
                    onClick={this.logout}>
                    Logout
                </button>
            </div>
        );
    }
}