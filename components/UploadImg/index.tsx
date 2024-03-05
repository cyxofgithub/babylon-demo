import * as React from "react";
import { memo } from "react";
import "./index.less";
import { Upload } from "antd";
import globalStore from "../../store";

//私有常量
//可抽离的逻辑处理函数/组件

const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
        <div style={{ marginTop: 8 }}>Upload</div>
    </button>
);

/**
 * 【组件功能】
 *
 * 【应用模块】
 *
 */

let UploadImg = memo((_props: IProps) => {
    //变量声明、解构
    //组件状态

    //网络IO

    //数据转换

    //逻辑处理函数

    const handleBeforeUpload = (file) => {
        // 获取图片的 URL
        const url = URL.createObjectURL(file);
        globalStore.setPictureUrl(url);
        // 阻止实际的上传操作
        return false;
    };
    //组件Effect

    return (
        <>
            <Upload
                beforeUpload={handleBeforeUpload}
                listType="picture-card"
                maxCount={1}
            >
                {uploadButton}
            </Upload>
        </>
    );
});

//props类型定义
interface IProps {}

//prop-type定义，可选
export { UploadImg };
