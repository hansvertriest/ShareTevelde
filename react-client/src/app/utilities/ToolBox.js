class ToolBox {
	handleFetchError = (res) => {
		if (res.code) {
			throw {msg: res.msg};
		}
		return res;
	}
}

const toolbox = new ToolBox()

export default toolbox;