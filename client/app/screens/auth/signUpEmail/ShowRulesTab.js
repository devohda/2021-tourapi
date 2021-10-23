import React from 'react';
import {TouchableOpacity, View, ScrollView} from 'react-native';
import AppText from '../../../components/AppText';
import {useTheme} from '@react-navigation/native';

const ShowRulesTab = ({navigation}) => {
    const { colors } = useTheme();

    return (
        <>
            <ScrollView flex={1} showsVerticalScrollIndicator={false}>
                <AppText style={{color: colors.mainColor, fontSize: 18, fontWeight: '700'}}>
                    개인정보 수집, 이용 동의서
                </AppText>
                <View style={{backgroundColor: colors.defaultColor, marginVertical: 14}}>
                    <AppText style={{padding: 8, fontSize: 12, fontWeight: '400', lineHeight: 19.2}}>
                        앱 '히든쥬얼 (Here.)'은 {'<'}개인정보보호법{'>'}에 의거하여, 아래와 같은 내용으로 개인정보를 수집하고 있습니다.
                        귀하께서는 아래 내용을 자세히 읽어 보시고, 모든 내용을 이해하신 후에 동의 여부를 결정해 주시기 바랍니다.
                    </AppText>
                </View>
                <View>
                    <AppText style={{color: colors.mainColor, fontSize: 14, fontWeight: '500', lineHeight: 23.8}}>
                        - 이용자가 제공한 모든 정보는 다음의 목적을 위해 활용하며, 하기 목적 이외의 용도로는 사용되지 않습니다. {'\n\n'}
                        1. 개인정보 수집 항목 및 수집·이용 목적 {'\n'}
                        가) 수집 항목 (필수항목) {'\n'}
                        - 이메일, 전화번호 등 회원가입에 포함된 정보 또는 신청자가 제공한 정보 {'\n'}
                        나) 수집 및 이용 목적 {'\n'}
                        - 히든쥬얼 유저 정보 활용을 통한 댓글, 보관함 생성, 유저 인기 순위 등 앱 데이터 전시 {'\n'}
                        - 히든쥬얼 유저에게 비밀번호 찾기 등 서비스 지원 {'\n\n'}
                        2. 개인정보 보유 및 이용기간 {'\n'}
                        - 회원이 직접 탈퇴 할 때 까지 {'\n\n'}
                        3. 동의거부관리 {'\n'}
                        - 귀하께서는 본 안내에 따른 개인정보 수집, 이용에 대하여 동의를 거부하실 권리가 있습니다. 다만,
                        귀하가 개인정보의 수집/이용에 동의를 거부하시는 경우에 장학생 선발 과정에 있어 불이익이 발생할 수
                        있음을 알려드립니다. {'\n'}
                    </AppText>
                </View>
            </ScrollView>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10}}>
                <TouchableOpacity onPress={() => {
                    navigation.pop(1);
                }} activeOpacity={0.8}>
                    <View>
                    <AppText style={{
                        color: colors.gray[3],
                        fontSize: 16,
                        fontWeight: '700',
                    }}>동의안함</AppText>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('emailTab');
                }} activeOpacity={0.8}>
                    <View>
                    <AppText style={{
                        color: colors.blue[1],
                        fontSize: 16,
                        fontWeight: '700',
                    }}>동의</AppText>
                    </View>
                </TouchableOpacity>
            </View>
        </>
    );
};

export default ShowRulesTab;