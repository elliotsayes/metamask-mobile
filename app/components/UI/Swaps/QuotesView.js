import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import FAIcon from 'react-native-vector-icons/FontAwesome';

import Text from '../../Base/Text';
import ScreenView from '../FiatOrders/components/ScreenView';
import StyledButton from '../StyledButton';
import { getSwapsQuotesNavbar } from '../Navbar';
import { colors } from '../../../styles/common';
import Device from '../../../util/Device';
import TokenIcon from './components/TokenIcon';
import QuotesSummary from './components/QuotesSummary';
import Engine from '../../../core/Engine';

const timeoutMilliseconds = 120 * 1000;

const fetchParams = {
	slippage: 3,
	sourceToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
	destinationToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
	sourceAmount: 10000000000000000,
	fromAddress: '0xb0da5965d43369968574d399dbe6374683773a65',
	balanceError: undefined,
	metaData: {
		sourceTokenInfo: {
			address: '0x6b175474e89094c44da98b954eedeac495271d0f',
			symbol: 'DAI',
			decimals: 18,
			iconUrl: 'https://foo.bar/logo.png'
		},
		destinationTokenInfo: {
			address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			symbol: 'USDC',
			decimals: 18
		},
		accountBalance: '0x0'
	}
};

const fetchQuotes = async () => {
	const { SwapsController } = Engine.context;
	await SwapsController.startFetchAndSetQuotes(fetchParams, fetchParams.metaData);
};

const styles = StyleSheet.create({
	screen: {
		flexGrow: 1,
		justifyContent: 'space-between'
	},
	topBar: {
		alignItems: 'center'
	},
	timerWrapper: {
		backgroundColor: colors.grey000,
		borderRadius: 20,
		marginVertical: 15,
		paddingVertical: 4,
		paddingHorizontal: 15,
		flexDirection: 'row',
		alignItems: 'center'
	},
	timer: {
		fontVariant: ['tabular-nums']
	},
	timerHiglight: {
		color: colors.red
	},
	content: {
		paddingHorizontal: 20,
		alignItems: 'center'
	},
	sourceTokenContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	tokenIcon: {
		marginHorizontal: 5
	},
	arrowDown: {
		color: colors.grey100,
		fontSize: Device.isSmallDevice() ? 22 : 25,
		marginHorizontal: 15,
		marginTop: 4,
		marginBottom: 2
	},
	amount: {
		textAlignVertical: 'center',
		fontSize: Device.isSmallDevice() ? 45 : 60
	},
	exchangeRate: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: Device.isSmallDevice() ? 1 : 1
	},
	bottomSection: {
		marginBottom: 10,
		alignItems: 'stretch',
		paddingHorizontal: 20
	},
	quotesSummary: {
		marginVertical: Device.isSmallDevice() ? 15 : 30
	},
	quotesSummaryHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexWrap: 'wrap'
	},
	quotesRow: {
		flexDirection: 'row'
	},
	quotesDescription: {
		flex: 1,
		flexWrap: 'wrap',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginRight: 6
	},
	quotesLegend: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginRight: 2
	},
	linkText: {
		color: colors.blue
	},
	quotesFiatColumn: {
		alignItems: 'flex-end',
		justifyContent: 'center'
	},
	infoIcon: {
		fontSize: 12,
		margin: 3,
		color: colors.blue
	},
	swapButton: {
		width: '100%'
	}
});

function SwapsQuotesView() {
	// const navigation = useContext(NavigationContext);
	const [nextTimeout, setNextTimeout] = useState(Date.now() + timeoutMilliseconds);
	const [fetchingQuotes, setFetchingQuotes] = useState(false);
	const [shouldFetchQuotes, setShouldFetchQuotes] = useState(false);
	const [remainingTime, setRemainingTime] = useState(timeoutMilliseconds);

	useEffect(() => {
		if (fetchingQuotes) {
			return;
		}
		const tick = setInterval(() => {
			const currentTime = Date.now();
			if (nextTimeout - currentTime < 1000) {
				setShouldFetchQuotes(true);
			} else {
				setRemainingTime(nextTimeout - currentTime);
			}
		}, 1000);
		return () => {
			clearInterval(tick);
		};
	}, [nextTimeout, fetchingQuotes]);

	useEffect(() => {
		(async () => {
			// remove this
			await fetchQuotes();
			if (shouldFetchQuotes) {
				try {
					setFetchingQuotes(true);
					setRemainingTime(timeoutMilliseconds);
					setNextTimeout(Date.now() + timeoutMilliseconds);
				} catch (e) {
					console.error(e);
				} finally {
					setShouldFetchQuotes(false);
					setFetchingQuotes(false);
				}
			}
		})();
	}, [shouldFetchQuotes]);

	return (
		<ScreenView contentContainerStyle={styles.screen}>
			<View style={styles.topBar}>
				<View style={styles.timerWrapper}>
					{fetchingQuotes ? (
						<>
							<ActivityIndicator size="small" />
							<Text> Fetching new quotes...</Text>
						</>
					) : (
						<Text primary>
							New quotes in{' '}
							<Text bold primary style={[styles.timer, remainingTime < 30000 && styles.timerHiglight]}>
								{new Date(remainingTime).toISOString().substr(15, 4)}
							</Text>
						</Text>
					)}
				</View>
			</View>
			<View style={styles.content}>
				<View style={styles.sourceTokenContainer}>
					<Text>100</Text>
					<TokenIcon
						icon="https://cloudflare-ipfs.com/ipfs/QmNYVMm3iC7HEoxfvxsZbRoapdjDHj9EREFac4BPeVphSJ"
						style={styles.tokenIcon}
					/>
					<Text>DAI</Text>
				</View>
				<IonicIcon style={styles.arrowDown} name="md-arrow-down" />
				<View style={styles.sourceTokenContainer}>
					<TokenIcon
						icon="https://cloudflare-ipfs.com/ipfs/QmacKydMVDvc6uqKSva9Mfm7ACskU98ofEbdZuru827JYJ"
						style={styles.tokenIcon}
					/>
					<Text>UNI</Text>
				</View>
				<Text primary style={styles.amount} numberOfLines={1} adjustsFontSizeToFit allowFontScaling>
					~2.0292028
				</Text>
				<View style={styles.exchangeRate}>
					<Text>1 DAI = 0.000324342 UNI</Text>
				</View>
			</View>
			<View style={styles.bottomSection}>
				<QuotesSummary style={styles.quotesSummary}>
					<QuotesSummary.Header style={styles.quotesSummaryHeader} savings>
						<QuotesSummary.HeaderText bold>Saving ~$120.38</QuotesSummary.HeaderText>
						<TouchableOpacity>
							<QuotesSummary.HeaderText small>View details →</QuotesSummary.HeaderText>
						</TouchableOpacity>
					</QuotesSummary.Header>
					<QuotesSummary.Body>
						<View style={styles.quotesRow}>
							<View style={styles.quotesDescription}>
								<View style={styles.quotesLegend}>
									<Text primary bold>
										Estimated gas fee
									</Text>
								</View>
								<Text primary bold>
									0.001303 ETH
								</Text>
							</View>
							<View style={styles.quotesFiatColumn}>
								<Text primary bold>
									$2.33 USD
								</Text>
							</View>
						</View>

						<View style={styles.quotesRow}>
							<View style={styles.quotesDescription}>
								<View style={styles.quotesLegend}>
									<Text>Max gas fee </Text>
									<TouchableOpacity>
										<Text style={styles.linkText}>Edit</Text>
									</TouchableOpacity>
								</View>
								<Text>0.009043 ETH</Text>
							</View>
							<View style={styles.quotesFiatColumn}>
								<Text>$22.33 USD</Text>
							</View>
						</View>

						<QuotesSummary.Separator />
						<View style={styles.quotesRow}>
							<TouchableOpacity style={styles.quotesRow}>
								<Text small>
									Quotes include a 0.875% Metamask fee{' '}
									<FAIcon name="info-circle" style={styles.infoIcon} />
								</Text>
							</TouchableOpacity>
						</View>
					</QuotesSummary.Body>
				</QuotesSummary>
				<StyledButton type="blue" containerStyle={styles.swapButton}>
					Tap to Swap
				</StyledButton>
			</View>
		</ScreenView>
	);
}

SwapsQuotesView.navigationOptions = ({ navigation }) => getSwapsQuotesNavbar(navigation);
const mapStateToProps = state => {
	console.log('----------');
	console.log('IS IN POLLING', state.engine.backgroundState.SwapsController.isInPolling);
	console.log('IS IN FETCH', state.engine.backgroundState.SwapsController.isInFetch);
	console.log('IS IN POLLING CYCLES LEFT', state.engine.backgroundState.SwapsController.pollingCyclesLeft);
	console.log('IS IN topAggId', state.engine.backgroundState.SwapsController.topAggId);
	console.log('IS IN errorKey', state.engine.backgroundState.SwapsController.errorKey);
	console.log('----------');

	return {
		tokens: state.engine.backgroundState.SwapsController.tokens
	};
};

export default connect(mapStateToProps)(SwapsQuotesView);
