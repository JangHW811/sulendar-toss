import { appsInToss } from '@apps-in-toss/framework/plugins';
import { defineConfig } from '@granite-js/react-native/config';

export default defineConfig({
  appName: 'sulendar',
  plugins: [
    appsInToss({
      brand: {
        displayName: '술렌다',
        primaryColor: '#7EC8E8',
        icon: '',
      },
      permissions: [],
    }),
  ],
});
