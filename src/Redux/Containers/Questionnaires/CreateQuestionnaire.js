import { connect } from 'react-redux';
import { createQuestionnaire, fetchQuestionnaire } from '../../Actions/Questionnaires';
import CreateQuestionnaire from '../../../Components/Forms/Question/CreateQuestionnaire';


function mapStateToProps(state) {
  return {
    activeQuestionnaire: state.Questionnaires.activeQuestionnaire,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createQuestionnaire: data => dispatch(createQuestionnaire(data)),
    fetchQuestionnaire: id => dispatch(fetchQuestionnaire(id)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateQuestionnaire);
