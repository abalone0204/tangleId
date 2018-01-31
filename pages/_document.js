// ./pages/_document.js
import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
	static getInitialProps({ renderPage }) {
		const { html, head, errorHtml, chunks } = renderPage()
		return { html, head, errorHtml, chunks }
	}

	render() {
		return (
			<html>
				<Head>
					<title>tangleID</title>
					<style>{'body { margin: 0 } /* custom! */'}</style>
					<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				</Head>
				<body className="custom_class">
					{this.props.customValue}
					<Main />
					<NextScript />
				</body>
			</html>
		)
	}
}