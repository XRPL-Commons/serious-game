<template>
    <div class="rounded-full bg-transparent p-2 transition-all flex justify-center items-center mt-20">        
        <button v-if="isConnected" @click="claimNft" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Claim my NFT
        </button>
        <button v-if="isConnected" @click="logOut" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Logout
        </button>
        <button v-if="!isConnected" @click="connectWallet" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Connect Wallet
        </button>
        <QRCodeModal :visible="modalVisible" :qrCodeSrc="qrCodeSrc" @close="modalVisible = false"/>
    </div>
</template>

<script>

// TODO: change localStorage to encrypted cookie
export default {
	async mounted() {
		const userToken = localStorage.getItem('user_token');
        const xrpAddress = localStorage.getItem('xrp_address');
		if (userToken && xrpAddress) {
			this.isConnected = true;
            this.userToken = userToken;
            this.xrpAddress = xrpAddress			
		}
        // try {
        //     const { data } = await useFetch('/api/mint-nft?transactionId=AE34243D835CB95B6D93FF112759E14C516E2D3E32AAC06C0E4DDAF02940909F', {
        //         method: 'POST'
        //     });
        // } catch (error) {
        //     alert("Error fetching transaction details: " + error)				
        // }
	},
	data() {
		return {
			// Xumm state
			isConnected: false,
			xrpAddress: '',
			userToken: '',
			modalVisible: false,
			qrCodeSrc: '',
			// Wallet functionnality
            txId: ''
		};
	},
	methods: {
		async connectWallet() {
			try {
				const { data } = await useFetch('/api/sign-in', {
					method: 'POST'
				});
				this.qrCodeSrc = data.value.refs.qr_png;
				this.modalVisible = true;
				this.initializeWebSocket(data.value.refs.websocket_status, "connection");
			} catch (error) {
				alert("Error connecting to Xumm: " + error)				
			}
		},
		async logOut() {
			localStorage.setItem('xrp_address', '');
			localStorage.setItem('user_token', '');
			this.isConnected = false;
		},
		async initializeWebSocket(url, step) {
			console.log(url)
			this.ws = new WebSocket(url);
			this.ws.onmessage = async (message) => {
				let responseObj = JSON.parse(message.data);				
      			if (responseObj.signed !== null && responseObj.signed !== undefined) {					
					this.modalVisible = false;
					this.isConnected = true;
					const { data } = await useFetch(`/api/payload?uuid=${responseObj.payload_uuidv4}`);                    
					console.log(data.value);
					localStorage.setItem('xrp_address', data.value.response.account);
                    this.xrpAddress = data.value.response.account;
					localStorage.setItem('user_token', data.value.application.issued_user_token);
                    this.userToken = data.value.application.issued_user_token;

                    if (data.value.payload.tx_type == 'Inscription') {

                    }
                    if (data.value.payload.tx_type === 'AccountSet') {
                        // data.value.response.environment_nodetype === 'TESTNET' --> might need to send to know in which environment we are
                        await this.mintNft(data.value.response.txid);
                    }
				}
			};
		},
		async getTransactionDetails(transactionId) {			
			try {
				const { data } = await useFetch(`/api/transaction-details?transactionId=${transactionId}`);
				console.log(data)
			} catch (error) {
				alert("Error getting transaction details: " + error);
			}		
		},
        async claimNft() {			
			try {                
				const { data } = await useFetch(`/api/mint-nft?xrpAddress=${this.xrpAddress}`, {
                    method: 'POST'
                });
				console.log(data)
			} catch (error) {
				alert("Error getting transaction details: " + error);
			}		
		},
		// async assignAuthorizedNftMinter() {
		// 	try {
		// 		const { data } = await useFetch(`/api/authorize-minter?userToken=${this.userToken}&approver=${this.xrpAddress}`, {
        //             method: 'POST'
        //         });
		// 		console.log(data)
		// 		this.qrCodeSrc = data.value.refs.qr_png;
		// 		this.modalVisible = true;
		// 		this.initializeWebSocket(data.value.refs.websocket_status);
		// 	} catch (error) {
		// 		alert("Error connecting to Xumm: " + error);
		// 	}
		// },
	}
}
</script>

<style scoped>
</style>
