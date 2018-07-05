import Component from '@ember/component';
import layout from '../templates/components/model-dropdown';

export default Component.extend({
	layout,

	replayModels: null,

	fillDropdown(){
		const { access_token } = this.get('session.data.authenticated');
		const url = `${ENV.APP.API_ROOT}${urlPath}`

		this.get('ajax').raw(url, {
			'id': this,
			headers: { 'Authorization': `Basic ${access_token}` },
			dataType: 'text',
			options: {
				arraybuffer: true
			}
		}
		).then((content) => {
			this.fill_dropdown(content.payload);
		}).catch((error) => {

			this.debug("Could not download file", error);
			throw new Error("Could not download file. Enable debugging in console");

		});
	},


  
});
