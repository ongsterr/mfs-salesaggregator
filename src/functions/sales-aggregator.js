import Papa from 'papaparse'
import moment from 'moment'

import firebase from '../firebase'
import { filesMetadata, papaBaseConfig } from '../config/Metadata'

const aggregatePlatformSalesData = () => {
	const { files } = filesMetadata
	const { firebaseStorageRef } = firebase

	files.forEach((f, i) => {
		firebaseStorageRef
			.child(`${f}.csv`)
			.getDownloadURL()
			.then((url) => {
				const papaConfig = {
					...papaBaseConfig,
					complete: (results, file) => {
						results.data.forEach((row, i) => {
							const cleanResult = salesDataWrangling(f)(row)
							const cleanId =
								typeof cleanResult.id === 'string'
									? cleanResult.id.replace(/[^A-Za-z0-9]/g, '')
									: cleanResult.id

							const id = `${cleanResult.platform}-${cleanId}`
							const updatedData = {
								[id]: cleanResult,
							}

							firebase[`allPlatformSalesDB`].update(updatedData, (e) => {
								if (e) {
									console.log(e)
								} else {
									console.log('Successfully loaded')
								}
							})
						})
					},
				}
				Papa.parse(url, papaConfig)
			})
			.catch((error) => {
				// console.log(error)
			})
	})
}

const salesDataWrangling = (data) => {
	switch (data) {
		case 'doordash':
			return doordashSalesWrangler
		case 'easi':
			return easiSalesWrangler
		case 'eatclub':
			return eatclubSalesWrangler
		case 'hungrypanda':
			return hungrypandaSalesWrangler
		case 'orderup':
			return orderupSalesWrangler
		case 'square':
			return squareSalesWrangler
		case 'ubereats':
			return ubereatsSalesWrangler
		case 'webflow':
			return webflowSalesWrangler

		default:
			break
	}
}

const doordashSalesWrangler = (data) => {
	return {
		platform: 'Doordash',
		time: `${data.timestamp_local_date} ${data.timestamp_local_time}`,
		merchant: data.store_name,
		type: data.transaction_type,
		id: data.transaction_id,
		gross_amount: data.subtotal,
		commission_amt: data.commission_with_gst,
		promotion: data.marketing_fees,
		net_amount: data.debit + data.credit,
	}
}

const easiSalesWrangler = (data) => {
	return {
		platform: 'EASI',
		time: data.order_created_at,
		merchant: data.merchant,
		type: data.order_type,
		id: data.order_no,
		gross_amount: data.net_sales,
		commission_amt:
			(parseFloat(data.commission_charged_gst_exclusive_) +
				parseFloat(data.commission_charged_gst_)) *
			-1,
		promotion:
			(parseFloat(data.merchant_discount) +
				parseFloat(data.merchant_voucher) +
				parseFloat(data.delivery_fee_on_merchant)) *
			-1,
		net_amount: data.settlement_amount,
	}
}

const hungrypandaSalesWrangler = (data) => {
	// const cleanMerchant = (data) => {
	// 	switch (data) {
	// 		case 'Bento Street 便当街':
	// 			return 'Bento Street'
	// 		case '便当街':
	// 			return 'Bento Street'
	// 		case '鸡场小街':
	// 			return 'Ayam Goreng Street Street'

	// 		default:
	// 			break
	// 	}
	// }

	return {
		platform: 'HungryPanda',
		time: data.time,
		merchant: data.merchant,
		type: 'Delivery',
		id: data.order,
		gross_amount: data.food_price,
		commission_amt: data.hungrypanda_commission + data.gst,
		promotion: data.discount + data.delivery_fee_merchant,
		net_amount: data.restaurant_net,
	}
}

const ubereatsSalesWrangler = (data) => {
	const deliveryType = data.dining_mode.includes(' - ')
		? data.dining_mode.substring(0, data.dining_mode.indexOf(' - '))
		: data.dining_mode

	return {
		platform: 'UberEats',
		time: data.order_date,
		merchant: data.shop_name,
		type: deliveryType,
		id: data.order_id,
		gross_amount: data.food_sales_including_gst,
		commission_amt: data.service_fee_including_gst,
		promotion:
			data.adjustments_excluding_gst +
			data.gst_on_adjustments +
			data.promo_spend_excluding_gst +
			data.gst_on_promo_spend +
			data.marketing_service_fee_adjustment,
		net_amount: data.payout,
	}
}

const orderupSalesWrangler = (data) => {
	const netSales =
		data.method === 'Delivery'
			? data.sub_total * (1 - 0.25) - data.discount_amount
			: data.sub_total - data.discount_amount

	return {
		platform: 'OrderUp',
		time: data.order_date,
		merchant: data.merchant,
		type: data.method,
		id: data.cart_id,
		gross_amount: data.sub_total,
		commission_amt: data.sub_total * 0.25,
		promotion: data.discount_amount,
		net_amount: netSales,
	}
}

const eatclubSalesWrangler = (data) => {
	const localDatetime = moment
		.utc(data.created_utc)
		.local()
		.format('DD/MM/YYYY HH:mm')

	return {
		platform: 'EatClub',
		time: localDatetime,
		merchant: 'Ayam Goreng Street',
		type: 'Pickup',
		id: data.id,
		gross_amount: data.amount / 0.8,
		commission_amt: 3,
		promotion: data.amount / 0.8 - data.amount,
		net_amount: data.amount / 0.8 - 3,
	}
}

const squareSalesWrangler = (data) => {
	const commission = parseFloat(data.fees.replace(/[^A-Za-z0-9]/g, ''))
	const discounts = parseFloat(data.discounts.replace(/[^A-Za-z0-9]/g, ''))

	return {
		platform: 'Square',
		time: `${data.date} ${data.time}`,
		merchant: data.location,
		type: 'Pickup',
		id: data.transaction_id,
		gross_amount: data.gross_sales,
		commission_amt: commission,
		promotion: discounts,
		net_amount: data.net_total,
	}
}

const webflowSalesWrangler = (data) => {
	const localDatetime = moment
		.utc(data.created_on)
		.local()
		.format('DD/MM/YYYY HH:mm')

	return {
		platform: 'Webflow',
		time: localDatetime,
		merchant: 'Bento Street',
		type: 'Delivery',
		id: data.order_id,
		gross_amount: data.sub_total + data.shipping_total,
		commission_amt: 0,
		promotion: data.discounts_total,
		net_amount: data.order_total,
	}
}

export default aggregatePlatformSalesData
