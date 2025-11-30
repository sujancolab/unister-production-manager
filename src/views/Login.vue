<template>
    <ion-page>
        <ion-content class="ion-padding">
            <div class="login-container">
                <ion-card class="login-card">
                    <ion-card-content>
                        <div class="logo-section">
                            <div class="logo-circle-large">P</div>
                            <h1>Production Manager</h1>
                            <p>Sign in to continue</p>
                        </div>

                        <ion-list>
                            <ion-item>
                                <ion-label position="stacked">Username</ion-label>
                                <ion-input v-model="username" type="text" placeholder="Enter username"></ion-input>
                            </ion-item>

                            <ion-item>
                                <ion-label position="stacked">Password</ion-label>
                                <ion-input v-model="password" type="password" placeholder="Enter password"
                                    @keyup.enter="handleLogin"></ion-input>
                            </ion-item>
                        </ion-list>

                        <ion-button expand="block" @click="handleLogin" :disabled="!username || !password"
                            class="login-button">
                            Login
                        </ion-button>
                    </ion-card-content>
                </ion-card>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup>
import { ref } from 'vue';
import { IonPage, IonContent, IonCard, IonCardContent, IonList, IonItem, IonLabel, IonInput, IonButton } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { toastController } from '@ionic/vue';
import { useAppStore } from '../store';

const router = useRouter();
const store = useAppStore();

const username = ref('');
const password = ref('');

const handleLogin = async () => {
    if (username.value && password.value) {
        store.login(username.value, password.value);

        const result = await store.login(username.value, password.value);

        if (!result.success) {
            const toast = await toastController.create({
                message: result.message,
                color: 'danger',
                duration: 1500
            });
            return toast.present();
        }

        const toast = await toastController.create({
            message: "Login successful",
            color: 'success',
            duration: 1500
        });
        toast.present();


        router.push('/dashboard');
    }
};
</script>

<style scoped>
.login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100%;
    background: linear-gradient(to bottom right, #dbeafe, #e0e7ff);
}

.login-card {
    max-width: 450px;
    width: 100%;
    margin: 20px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.logo-section {
    text-align: center;
    margin-bottom: 32px;
}

.logo-circle-large {
    width: 80px;
    height: 80px;
    background-color: #4f46e5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 48px;
    font-weight: bold;
    margin: 0 auto 16px;
}

h1 {
    font-size: 28px;
    font-weight: bold;
    color: #1f2937;
    margin: 16px 0 8px;
}

p {
    color: #6b7280;
    margin: 0;
}

ion-list {
    margin: 24px 0;
}

.login-button {
    margin-top: 24px;
    --background: #4f46e5;
    font-weight: 600;
}
</style>