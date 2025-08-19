import dayjs from "dayjs";
import StringUtil from "../frameworks/StringUtil";

/**
 * 必須選択
 */
const custom_rule_is = {
    message: "{_field_}を選択してください",
    // @ts-ignore
    validate: function (value: boolean) {
        return value;
    },
};

/**
 * 全角カナ文字のみ
 */
const custom_rule_kana = {
    message: "{_field_}は全角カナのみ指定してください",
    // @ts-ignore
    // 全角カナ文字のみ
    validate: function (value: string) {
        return !!value.match(/^[ァ-ヶー　]*$/);
    },
};

/**
 * 電話・FAX・携帯番号チェック(厳密にやりすぎると新しい規格に対応できない)
 */
const phone = {
    message: "{_field_}を正しく設定してください",
    // @ts-ignore
    validate: function (value) {
        if (
            value.match(
                /^(\+\d{1,3}|0\d{1,4})(\s|-)\d{1,4}-\d{1,4}(-+\d{1,4}|)$/
            )
        ) {
            return true;
        }
    },
};

/**
 * 配列の最大項目数以下
 */
const custom_rule_collection_max = {
    params: [
        {
            name: "maxLength",
        },
    ],
    message: "{_field_}は{maxLength}つまでしか選択することができません",
    // @ts-ignore
    validate: function (value: String, { maxLength }) {
        if (!Array.isArray(value)) {
            return false;
        }
        return value.length <= maxLength;
    },
};

/**
 * 日付検証
 */
const custom_rule_date_day_required = {
    message: "{_field_}は必須です",
    // @ts-ignore
    validate: function (value: string) {
        const valJs = dayjs(value);
        return valJs.isValid();
    },
};

/**
 * 時刻のみ検証
 */
const custom_rule_date_hhmm_required = {
    message: "{_field_}は必須です",
    // @ts-ignore
    validate: function (value: string) {
        return value != "00:00";
    },
};

// 日付検証Function
function isDate(strDate: string) {
    return !isNaN(Date.parse(strDate ?? ""));
}

/**
 * [From-To]の日付検証
 */
const custom_rule_date_or_later = {
    params: [
        {
            name: "target",
            isTarget: true,
        },
    ],
    message: "{_field_}は{target}以降を指定してください",
    // @ts-ignore
    validate: function (value: string, { target }) {
        // 未入力は比較しない
        if (!isDate(value) || !isDate(target)) {
            return true;
        }

        const formatedVal = dayjs(value).format("YYYY-MM-DD HH:mm:ss");
        const formatedTgt = dayjs(target).format("YYYY-MM-DD HH:mm:ss");

        // 両方に日付が入力されて(target <= value)の場合は検証ok
        return formatedTgt <= formatedVal;
    },
};

/**
 * 指定範囲の日付のみ有効
 */
const custom_rule_date_range = {
    params: [
        {
            name: "range",
        },
    ],
    message: "{_field_}が範囲を超えています",
    // @ts-ignore
    validate: function (value: string, { range }) {
        // 未入力は比較しない
        if (!isDate(value) || !range) {
            return true;
        }

        // rangeを正規表現で数値と文字列に分割
        // 単位は大文字と小文字を区別せず複数形と短い形をサポートします
        // 短い形式では大文字と小文字が区別されることに注意してください
        // 年: y or year
        // 月: M or month
        // 週: w or week
        // 日: d or day
        // 時: h or hour
        // 分: m or minute
        // 秒: s or second
        const num = range.match(/\d+/);
        const interval = range.match(/[a-zA-Z]+/);

        // from-toをdayjsに設定
        const now = dayjs(dayjs().format("YYYY-MM-DD"));
        const from = now.subtract(num, interval);
        const to = now.add(num, interval);

        // 第4引数に[]()を使って開始日・終了日を含めるかどうか指定できる
        // 開始日:含める[ 含めない( 終了日:含める] 含めない)

        // 日付が(from <= value < to)の場合は検証ok
        // @ts-ignore
        return dayjs(value).isBetween(from, to, null, "[)");
    },
};

// 数値検証Function
function isNumber(value: any): boolean {
    return !Number.isNaN(parseInt(value));
}

/**
 * 数値の大小比較
 */
const custom_rule_number_from = {
    params: [
        {
            name: "target",
            isTarget: true,
        },
    ],
    message: "{_field_}は{target}以降を指定してください",
    // @ts-ignore
    validate: function (value: string, { target }) {
        // 数値以外は比較しない
        if (!isNumber(value) || !isNumber(target)) {
            return true;
        }

        // 両方に日付が入力されて(target <= value)の場合は検証ok
        return Number(target) <= Number(value);
    },
};

const custom_rule_number_to = {
    params: [
        {
            name: "target",
            isTarget: true,
        },
    ],
    message: "{_field_}は{target}以前を指定してください",
    // @ts-ignore
    validate: function (value: string, { target }) {
        // 数値以外は比較しない
        if (!isNumber(value) || !isNumber(target)) {
            return true;
        }

        // 両方に日付が入力されて(target <= value)の場合は検証ok
        return Number(target) >= Number(value);
    },
};

/**
 * 文字列桁数検証(全角2バイト・半角1バイトで文字数を制限)
 */
const custom_rule_max_bytelength = {
    params: ["full_width", "half_width"],
    message:
        "{_field_}は全角{full_width} [半角{half_width}]文字まで入力可能です",
    // @ts-ignore
    validate: function (value: string, { full_width, half_width }) {
        // カスタムルールの全角文字数(full_width)はValidation表示用で無視しており半角文字数(half_width)で検証してます
        // ShiftJISのバイト数を取得
        let length = StringUtil.getByteLengthOfShiftJIS(value);

        return length <= half_width;
    },
};

/**
 * 0以外の数値のみ
 */
const custom_rule_non_zero = {
    message: "0以外を指定してしてください",
    // @ts-ignore
    validate: function (value: string) {
        // 数値以外は比較しない
        if (!isNumber(value)) {
            return true;
        }

        return Number(value) != 0;
    },
};

/**
 * 0の数値のみ
 */
const custom_rule_zero_only = {
    message: "0を指定してしてください",
    // @ts-ignore
    validate: function (value: string) {
        // 数値以外は比較しない
        if (!isNumber(value)) {
            return true;
        }

        return Number(value) == 0;
    },
};

export {
    custom_rule_is,
    custom_rule_kana,
    phone,
    custom_rule_collection_max,
    custom_rule_date_day_required,
    custom_rule_date_hhmm_required,
    custom_rule_date_or_later,
    custom_rule_date_range,
    custom_rule_number_from,
    custom_rule_number_to,
    custom_rule_max_bytelength,
    custom_rule_non_zero,
    custom_rule_zero_only,
};
