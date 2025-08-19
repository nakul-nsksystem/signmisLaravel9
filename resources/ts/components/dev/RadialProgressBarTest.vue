<template>
    <div>
        <!-- 進む・戻る button -->
        <button type="submit" class="btn btn-success" @click.prevent="prev()">Prev</button>
        <button type="submit" class="btn btn-success" @click.prevent="next()">Next</button>
        <button type="submit" class="btn btn-light"   @click.prevent="timer()">{{ timerLabel }}</button>

        <!-- 放射状(円)プログレスバー [Vueコンポーネント化] -->
        <radial-progress-bar
            :completed-steps="completedSteps"
            :total-steps="totalSteps"
            :diameter=200
            :animate-speed=200
        >
            <p>Total steps: {{ totalSteps }}</p>
            <p>Completed steps: {{ completedSteps }}</p>
        </radial-progress-bar>

        <!-- プログレスバー [Bootstrap5] -->
        <div class="progress">
            <div class="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
               :aria-valuenow=completedSteps
               :style="('width: ' + completedSteps + '%')"
            >{{ completedSteps }} %</div>
        </div>

        <a ref="" class="nav-link" href="https://wyzantinc.github.io/vue-radial-progress/">
            参考サイト<br>
            https://wyzantinc.github.io/vue-radial-progress/
        </a>
    </div>
</template>

<script>
export default {
    data : function () {
        return {
            completedSteps: 0,          // 完了ステップ
            totalSteps: 100,            // 総ステップ
            intervId: null,             // タイマーで使用するintervalId
            timerLabel : "Timer Start"  // Timerボタンの説明文
        }
    } ,
    methods : {
        prev() {
            this.completedSteps -- ;
        } ,
        next() {
            this.completedSteps ++ ;
        } ,
        timer() {
            // 既にインターバルがセットされているかどうか検査
            if (!this.intervId) {
                // タイマー開始
                this.intervId   = setInterval(this.next, 500) ;
                this.timerLabel = "Timer Stop" ;
            } else {
                // タイマー終了
                clearInterval(this.intervId) ;
                this.intervId   = null ;
                this.timerLabel = "Timer Start" ;
            }
        } ,
    } ,
}
</script>
