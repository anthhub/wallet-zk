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
        loading: 'Loading...',
        success: 'Success',
        failed: 'Failed',
        copy: 'Copy',
        copied: 'Copied',
        delete: 'Delete',
        edit: 'Edit',
        save: 'Save'
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
        connected: 'Connected',
        connecting: 'Connecting',
        pendingRequest: 'Pending Request...',
        disconnect: 'Disconnect',
        connect: 'Connect Wallet',
        network: 'Network',
        mainnet: 'Ethereum Mainnet',
        goerli: 'Goerli Testnet',
        sepolia: 'Sepolia Testnet'
      },
      error: {
        invalidAddress: 'Invalid address',
        insufficientBalance: 'Insufficient balance',
        transactionFailed: 'Transaction failed',
        cameraAccessDenied: 'Camera access denied',
        loadingFailed: 'Failed to load data',
        invalidPin: 'Invalid PIN code',
        pinMismatch: 'PIN codes do not match',
        invalidMnemonic: 'Invalid mnemonic phrase',
        networkError: 'Network connection error',
        unknownError: 'Unknown error occurred'
      },
      welcome: {
        title: 'Welcome to Web3 Wallet',
        subtitle: 'Create a new wallet or import an existing one to get started',
        createWallet: 'Create New Wallet',
        importWallet: 'Import Wallet',
        loading: 'Creating your wallet...',
        setupPin: 'Set up PIN Code',
        confirmPin: 'Confirm PIN Code',
        pinInfo: 'PIN code must be 6 digits'
      },
      account: {
        viewMnemonic: 'View Mnemonic',
        deleteAccount: 'Delete Account',
        deleteConfirm: 'Delete Confirmation',
        deleteWarning: 'This action will permanently delete your account data. Make sure you have backed up your mnemonic phrase, otherwise you will not be able to recover your account.',
        verifyPin: 'Verify PIN',
        enterPinDelete: 'Enter PIN to delete account',
        enterPinMnemonic: 'Enter PIN to view mnemonic',
        backupMnemonic: 'Backup Mnemonic',
        backupWarning: 'Never share your mnemonic phrase with anyone. Anyone with your mnemonic phrase can take control of your wallet.',
        settings: 'Account Settings',
        security: 'Security Settings',
        enterMnemonic: 'Enter your recovery phrase',
        mnemonicWarning: 'Write down these words in the right order and keep them safe',
        copyAddress: 'Copy Address',
        addressCopied: 'Address copied to clipboard'
      },
      transaction: {
        confirm: 'Confirm Transaction',
        review: 'Review Transaction',
        enterPin: 'Enter PIN to confirm',
        fee: 'Network Fee',
        total: 'Total Amount',
        confirmWarning: 'Please review all transaction details carefully before confirming',
        pending: 'Transaction Pending',
        success: 'Transaction Successful',
        failed: 'Transaction Failed',
        viewExplorer: 'View in Explorer'
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
        loading: '加载中...',
        success: '成功',
        failed: '失败',
        copy: '复制',
        copied: '已复制',
        delete: '删除',
        edit: '编辑',
        save: '保存'
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
        sent: '已发送',
        received: '已接收',
        to: '发送至',
        from: '来自',
        noTransactions: '没有找到交易记录',
        scanHint: '将二维码置于框内扫描',
        connected: '已连接',
        connecting: '连接中',
        pendingRequest: '等待处理请求...',
        disconnect: '断开连接',
        connect: '连接钱包',
        network: '网络',
        mainnet: '以太坊主网',
        goerli: 'Goerli测试网',
        sepolia: 'Sepolia测试网'
      },
      error: {
        invalidAddress: '无效地址',
        insufficientBalance: '余额不足',
        transactionFailed: '交易失败',
        cameraAccessDenied: '相机访问被拒绝',
        loadingFailed: '加载数据失败',
        invalidPin: 'PIN码无效',
        pinMismatch: 'PIN码不匹配',
        invalidMnemonic: '助记词无效',
        networkError: '网络连接错误',
        unknownError: '发生未知错误'
      },
      welcome: {
        title: '欢迎使用 Web3 钱包',
        subtitle: '创建新钱包或导入已有钱包开始使用',
        createWallet: '创建新钱包',
        importWallet: '导入钱包',
        loading: '正在创建您的钱包...',
        setupPin: '设置PIN码',
        confirmPin: '确认PIN码',
        pinInfo: 'PIN码必须为6位数字'
      },
      account: {
        viewMnemonic: '查看助记词',
        deleteAccount: '删除账户',
        deleteConfirm: '删除确认',
        deleteWarning: '此操作将永久删除您的账户数据。请确保您已经备份了助记词，否则将无法恢复您的账户。',
        verifyPin: '验证PIN码',
        enterPinDelete: '请输入PIN码以确认删除账户',
        enterPinMnemonic: '请输入PIN码以查看助记词',
        backupMnemonic: '备份助记词',
        backupWarning: '请勿将助记词分享给任何人。任何知道您助记词的人都可以完全控制您的钱包。',
        settings: '账户设置',
        security: '安全设置',
        enterMnemonic: '输入恢复短语',
        mnemonicWarning: '将这些单词按正确顺序写下并妥善保存',
        copyAddress: '复制地址',
        addressCopied: '地址已复制到剪贴板'
      },
      transaction: {
        confirm: '确认交易',
        review: '检查交易详情',
        enterPin: '输入PIN码以确认',
        fee: '网络费用',
        total: '总金额',
        confirmWarning: '确认前请仔细检查所有交易详情',
        pending: '交易处理中',
        success: '交易成功',
        failed: '交易失败',
        viewExplorer: '在区块浏览器中查看'
      }
    }
  }
};

// 获取保存的语言设置或浏览器语言
const getInitialLanguage = () => {
  const savedLang = localStorage.getItem('preferred_language');
  if (savedLang && ['en', 'zh'].includes(savedLang)) {
    return savedLang;
  }
  
  // 获取浏览器语言设置
  const browserLang = navigator.language.toLowerCase();
  return browserLang.startsWith('zh') ? 'zh' : 'en';
};

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  },
  detection: {
    order: ['localStorage', 'navigator'],
  }
});

// 监听语言变化
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  localStorage.setItem('preferred_language', lng);
});

export default i18n; 