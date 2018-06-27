import ApplicationRendering from 'explorviz-frontend/components/visualization/rendering/application-rendering';
import layout from '../templates/components/modeleditor-visualization';
import { inject as service } from "@ember/service";

export default ApplicationRendering.extend({
  layout,
});
