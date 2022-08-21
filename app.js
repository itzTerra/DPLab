import { Simulator } from "./Components/simulator.js";

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes: [
    {path: '/index.html', component: Simulator},
    {path: '/PendulumVue/simulator', component: Simulator},
    {path: '/PendulumVue/:pathMatch(.*)*', redirect: '/PendulumVue/'},
  ],
})

const app = Vue.createApp({});

app.use(router);
app.mount('#app');

