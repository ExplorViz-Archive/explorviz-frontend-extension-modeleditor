import LandscapeRendering from 'explorviz-frontend/components/visualization/rendering/landscape-rendering';
import layout from '../templates/components/modeleditor-visualization';
import { inject as service } from "@ember/service";

/**
*Enable entering the application perspective from the landscape perspective.
* @class Merged-Landscape-Rendering-Component
* @extends Landscape-Rendering-Component
*/
export default LandscapeRendering.extend({
  layout,
});