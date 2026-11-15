const canvasDownloader = () => {
	const canvas = document.querySelector('canvas')
	const dataURL = canvas!.toDataURL()
	const link = document.createElement('a')

	link.href = dataURL
	link.download = 'organic-view.png'
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
}

export default canvasDownloader
