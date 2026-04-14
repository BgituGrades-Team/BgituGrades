import VisitActivity from '../VisitActivity';
import TaskActivity from '../TaskActivity';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ReportActivity from '../ReportActivity';
import AdminActivity from '../AdminActivity/AdminActivity';
import RoutesModal from '../shared/modals/RoutesModal';

interface PropsInterface {
    closeModal: () => void;
    isModalOpen: boolean;
}

function RoutesManager({closeModal, isModalOpen}: PropsInterface) {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<VisitActivity></VisitActivity>}></Route>
                <Route path="/visit" element={<VisitActivity></VisitActivity>}></Route>
                <Route path="/task" element={<TaskActivity></TaskActivity>}></Route>
                <Route path="/report" element={<ReportActivity></ReportActivity>}></Route>
                <Route path="/admin" element={<AdminActivity></AdminActivity>}></Route>
            </Routes>
            <RoutesModal close={closeModal} isOpen={isModalOpen}/>
        </Router>
    )
}

export default RoutesManager