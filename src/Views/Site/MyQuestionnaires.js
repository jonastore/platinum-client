import React from 'react';
import Questionnaires from '../../Redux/Containers/Questionnaires/Questionnaires';
import { PageTitle } from '../../Lib/Common/Views';

const MyQuestionnaires = () => (
  <div className="center-content-grid max-width-35 margin-auto my-questionaires">
    <PageTitle title="My Questionnaires" />
    <Questionnaires />
  </div>);

export default MyQuestionnaires;
