import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      wallet: {
        title: 'Web3 Wallet',
        balance: 'Balance',
        send: 'Send',
        receive: 'Receive',
        scan: 'Scan',
        history: 'History',
        assets: 'My Assets',
        manage: 'Manage',
        connect: 'Connect dApp',
        disconnect: 'Disconnect'
      },
      welcome: {
        title: 'Welcome to Web3 Wallet',
        createWallet: 'Create New Wallet',
        importWallet: 'Import Wallet'
      }
    }
  },
  zh: {
    translation: {
      wallet: {
        title: 'Web3 钱包',
        balance: '余额',
        send: '发送',
        receive: '接收',
        scan: '扫描',
        history: '历史',
        assets: '我的资产',
        manage: '管理',
        connect: '连接 dApp',
        disconnect: '断开连接'
      },
      welcome: {
        title: '欢迎使用 Web3 钱包',
        createWallet: '创建新钱包',
        importWallet: '导入钱包'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh', // 默认语言
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 