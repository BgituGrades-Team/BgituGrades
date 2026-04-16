import VisitActivity from '../VisitActivity';
import TaskActivity from '../TaskActivity';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ReportActivity from '../ReportActivity';
import AdminActivity from '../AdminActivity/AdminActivity';
import RoutesModal from '../shared/modals/RoutesModal';
import useSingleGroupAndDiscipline from '../shared/hooks/useSingleGroupAndDiscipline';
import { SingleGroupAndDisciplineContext } from '../shared/utils/contexts';
import type { SingleGroupAndDisciplineInterface } from '../shared/types/interfaces';

interface PropsInterface {
    closeModal: () => void;
    isModalOpen: boolean;
}

function RoutesManager({closeModal, isModalOpen}: PropsInterface) {
    const [
        groupId, setGroupId,
        disciplineId, setDisciplineId,
        repType, setRepType,
    ] = useSingleGroupAndDiscipline()
    const values: SingleGroupAndDisciplineInterface = {
        groupVal: groupId,
        groupDispatcher: setGroupId,
        disciplineVal: disciplineId,
        disciplineDispatcher: setDisciplineId,
        repTypeVal: repType,
        repTypeDispatcher: setRepType,
    }
    return (
        <Router>
            <SingleGroupAndDisciplineContext.Provider
                value={values}
            >
            <Routes>
                <Route path="/" element={<VisitActivity></VisitActivity>}></Route>
                <Route path="/visit" element={<VisitActivity></VisitActivity>}></Route>
                <Route path="/task" element={<TaskActivity></TaskActivity>}></Route>
                <Route path="/report" element={<ReportActivity></ReportActivity>}></Route>
                <Route path="/admin" element={<AdminActivity></AdminActivity>}></Route>
            </Routes>
            <RoutesModal close={closeModal} isOpen={isModalOpen}/>
            </SingleGroupAndDisciplineContext.Provider>
        </Router>
    )
}

export default RoutesManager