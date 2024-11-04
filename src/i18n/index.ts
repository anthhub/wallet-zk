import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const resources = {
  en: {
    translation: {
      common: {
        cancel: 'Cancel',
        confirm: 'Confirm',
        send: 'Send',
        sending: 'Sending...',
        receive: 'Receive',
        scan: 'Scan',
        history: 'History',
        close: 'Close',
        error: 'Error',
        loading: 'Loading...'
      },
      wallet: {
        title: 'Web3 Wallet',
        account: 'Account',
        address: 'Address',
        balance: 'Balance',
        assets: 'My Assets',
        recipientAddress: 'Recipient Address',
        amount: 'Amount',
        send: 'Send',
        receive: 'Receive',
        scan: 'Scan',
        history: 'History',
        sent: 'Sent',
        received: 'Received',
        to: 'To',
        from: 'From',
        noTransactions: 'No transactions found',
        scanHint: 'Position QR code within frame to scan',
        connected: "已连接",
        connecting: "正在连接",
        pendingRequest: "等待处理请求...",
        disconnect: "断开连接",
        connect: "连接钱包"
      },
      error: {
        invalidAddress: 'Invalid address',
        insufficientBalance: 'Insufficient balance',
        transactionFailed: 'Transaction failed',
        cameraAccessDenied: 'Camera access denied',
        loadingFailed: 'Failed to load data'
      },
      welcome: {
        title: 'Welcome to Web3 Wallet',
        subtitle: 'Create a new wallet or import an existing one to get started',
        createWallet: 'Create New Wallet',
        importWallet: 'Import Wallet',
        loading: 'Creating your wallet...'
      },
      account: {
        viewMnemonic: 'View Mnemonic',
        deleteAccount: 'Delete Account',
        deleteConfirm: 'Delete Confirmation',
        deleteWarning: 'This action will permanently delete your account data. Make sure you have backed up your mnemonic phrase, otherwise you will not be able to recover your account.',
        verifyPin: 'Verify PIN',
        enterPinDelete: 'Enter PIN to delete account',
        enterPinMnemonic: 'Enter PIN to view mnemonic'
      }
    }
  },
  zh: {
    translation: {
      common: {
        cancel: '取消',
        confirm: '确认',
        send: '发送',
        sending: '发送中...',
        receive: '接收',
        scan: '扫描',
        history: '历史',
        close: '关闭',
        error: '错误',
        loading: '加载中...'
      },
      wallet: {
        title: 'Web3 钱包',
        account: '账户',
        address: '地址',
        balance: '余额',
        assets: '我的资产',
        recipientAddress: '接收地址',
        amount: '金额',
        send: '发送',
        receive: '接收',
        scan: '扫描',
        history: '历史',
        sent: '发送',
        received: '接收',
        to: '到',
        from: '从',
        noTransactions: '没有找到交易',
        scanHint: '将二维码置于框架内扫描',
        connected: "已连接",
        connecting: "正在连接",
        pendingRequest: "等待处理请求...",
        disconnect: "断开连接",
        connect: "连接钱包"
      },
      error: {
        invalidAddress: '无效地址',
        insufficientBalance: '余额不足',
        transactionFailed: '交易失败',
        cameraAccessDenied: '相机访问被拒绝',
        loadingFailed: '加载数据失败'
      },
      welcome: {
        title: '欢迎使用 Web3 钱包',
        subtitle: '创建新钱包或导入已有钱包开始使用',
        createWallet: '创建新钱包',
        importWallet: '导入钱包',
        loading: '正在创建您的钱包...'
      },
      account: {
        viewMnemonic: '查看助记词',
        deleteAccount: '删除账户',
        deleteConfirm: '删除确认',
        deleteWarning: '此操作将永久删除您的账户数据。请确保您已经备份了助记词，否则将无法恢复您的账户。',
        verifyPin: '验证PIN码',
        enterPinDelete: '请输入PIN码以确认删除账户',
        enterPinMnemonic: '请输入PIN码以查看助记词'
      }
    }
  }
} as const;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 