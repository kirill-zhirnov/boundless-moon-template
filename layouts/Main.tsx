import {ReactNode, useEffect} from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingLine from '../components/LoadingLine';
import AlertWidget from '../components/Alert';
import {useRouter} from 'next/router';
import {useAppDispatch} from '../hooks/redux';
import {endRouting, startRouting} from '../redux/reducers/app';
import {hideCall2Order} from '../redux/reducers/cart';

const shopBaseUrl = process.env.BOUNDLESS_BASE_URL || '';

export default function MainLayout({children, title, metaData}: IMainLayoutProps) {
	const {canonicalUrl, imgUrl, description} = metaData || {};
	const router = useRouter();
	const dispatch = useAppDispatch();

	useEffect(() => {
		const handleStart = () => {
			dispatch(hideCall2Order());
			dispatch(startRouting());
		};
		const handleComplete = () => dispatch(endRouting());

		router.events.on('routeChangeStart', handleStart);
		router.events.on('routeChangeComplete', handleComplete);
		router.events.on('routeChangeError', handleComplete);

		return () => {
			router.events.off('routeChangeStart', handleStart);
			router.events.off('routeChangeComplete', handleComplete);
			router.events.off('routeChangeError', handleComplete);
		};
	}, []);//eslint-disable-line

	return (
		<>
			<Head>
				<meta charSet='UTF-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />
				<meta httpEquiv='X-UA-Compatible' content='ie=edge' />

				<link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
				<link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
				<link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
				<link rel='manifest' href='/site.webmanifest' />
				<link rel='mask-icon' href='/safari-pinned-tab.svg' color='#5bbad5' />
				{canonicalUrl && <link rel='canonical' href={canonicalUrl} />}
				<meta name='msapplication-TileColor' content='#da532c' />
				<meta name='theme-color' content='#ffffff' />

				<meta property='og:type' content='website' />
				<meta property='og:title' content={title || 'Boundless-Commerce Shop Example'} />
				<meta property='og:url' content={canonicalUrl || shopBaseUrl} />
				<meta property='og:image' content={imgUrl || (shopBaseUrl+ '/og.jpeg')} />
				{description && <meta property='og:description' content={description} />}

				<title>{title || 'Boundless-Commerce Shop Example'}</title>
			</Head>
			<LoadingLine />
			<AlertWidget />
			<div className='page'>
				<Header />
				<main className='page__main'>
					{children}
				</main>
				<Footer />
			</div>
		</>
	);
}

interface IMainLayoutProps {
	children: ReactNode | ReactNode[];
	title?: string;
	metaData?: IMetaData;
}

interface IMetaData {
	canonicalUrl?: string;
	imgUrl?: string|null;
	description?: string|null;
}