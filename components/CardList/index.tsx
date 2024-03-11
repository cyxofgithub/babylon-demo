import { memo } from "react";
import * as React from "react";
import { Card, Col, Row } from "antd";

//私有常量

//可抽离的逻辑处理函数/组件

/**
 * 【组件功能】
 *
 * 【应用模块】
 *
 */

let CardList = memo((_props: IProps) => {
    //变量声明、解构
    const { list, onSelect } = _props;

    //组件状态

    //网络IO

    //数据转换

    //逻辑处理函数

    //组件Effect

    return (
        <>
            <Row justify="start" gutter={16}>
                {list.map((item) => {
                    return (
                        <Col span={8} style={{ marginTop: 16 }}>
                            <Card
                                styles={{
                                    body: {
                                        padding: 0,
                                    },
                                }}
                                onClick={() => onSelect(item)}
                                hoverable
                                cover={<img alt="example" src={item.url} />}
                            ></Card>
                        </Col>
                    );
                })}
            </Row>
        </>
    );
});

//props类型定义
export interface IItem {
    url: string;
    val: any;
}
interface IProps {
    list: IItem[];
    onSelect: (item: IItem) => void;
}

//prop-type定义，可选

export { CardList };
