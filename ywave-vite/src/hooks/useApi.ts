import { useState, useCallback } from 'react';
import { userApi, storeApi, bookmarkApi, preferenceApi, reviewApi } from '../api/services';
import { createInitialApiState, updateApiState, createApiErrorMessage } from '../utils/apiUtils';

// API 상태 타입
export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// API Hook 기본 타입
export interface UseApiReturn<T> extends ApiState<T> {
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

// 공통 API Hook 팩토리 함수
const createApiHook = <T>(
  apiFunction: (...args: any[]) => Promise<T>,
  operationName: string
) => {
  return () => {
    const [state, setState] = useState<ApiState<T>>(createInitialApiState<T>());

    const execute = useCallback(async (...args: any[]) => {
      setState(prev => updateApiState.start(prev));
      try {
        const result = await apiFunction(...args);
        setState(updateApiState.success(result));
        return result;
      } catch (error) {
        const errorMessage = createApiErrorMessage(operationName, error);
        setState(updateApiState.error(errorMessage));
        throw error;
      }
    }, [apiFunction, operationName]);

    const reset = useCallback(() => {
      setState(createInitialApiState<T>());
    }, []);

    return {
      ...state,
      execute,
      reset,
    };
  };
};

// 사용자 API Hook
export const useUserApi = () => {
  const [signupState, setSignupState] = useState<ApiState<any>>(createInitialApiState());
  const [loginState, setLoginState] = useState<ApiState<any>>(createInitialApiState());
  const [emailCheckState, setEmailCheckState] = useState<ApiState<any>>(createInitialApiState());

  const signup = useCallback(async (data: any) => {
    setSignupState(prev => updateApiState.start(prev));
    try {
      const result = await userApi.signup(data);
      setSignupState(updateApiState.success(result));
      return result;
    } catch (error) {
      const errorMessage = createApiErrorMessage('회원가입', error);
      setSignupState(updateApiState.error(errorMessage));
      throw error;
    }
  }, []);

  const login = useCallback(async (data: any) => {
    setLoginState(prev => updateApiState.start(prev));
    try {
      const result = await userApi.login(data);
      setLoginState(updateApiState.success(result));
      return result;
    } catch (error) {
      const errorMessage = createApiErrorMessage('로그인', error);
      setLoginState(updateApiState.error(errorMessage));
      throw error;
    }
  }, []);

  const checkEmailDuplicate = useCallback(async (data: any) => {
    setEmailCheckState(prev => updateApiState.start(prev));
    try {
      const result = await userApi.checkEmailDuplicate(data);
      setEmailCheckState(updateApiState.success(result));
      return result;
    } catch (error) {
      const errorMessage = createApiErrorMessage('이메일 확인', error);
      setEmailCheckState(updateApiState.error(errorMessage));
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    userApi.logout();
    setLoginState(createInitialApiState());
  }, []);

  return {
    signup,
    signupState,
    login,
    loginState,
    checkEmailDuplicate,
    emailCheckState,
    logout,
  };
};

// 선호도 설정 API Hook
export const usePreferenceApi = () => {
  const [setRegionState, setSetRegionState] = useState<ApiState<any>>(createInitialApiState());
  const [getRegionState, setGetRegionState] = useState<ApiState<any>>(createInitialApiState());
  const [setCategoriesState, setSetCategoriesState] = useState<ApiState<any>>(createInitialApiState());
  const [getCategoriesState, setGetCategoriesState] = useState<ApiState<any>>(createInitialApiState());

  const setPreferredRegion = useCallback(async (data: any) => {
    setSetRegionState(prev => updateApiState.start(prev));
    try {
      const result = await preferenceApi.setPreferredRegion(data);
      setSetRegionState(updateApiState.success(result));
      return result;
    } catch (error) {
      const errorMessage = createApiErrorMessage('선호 지역 설정', error);
      setSetRegionState(updateApiState.error(errorMessage));
      throw error;
    }
  }, []);

  const getPreferredRegion = useCallback(async () => {
    setGetRegionState(prev => updateApiState.start(prev));
    try {
      const result = await preferenceApi.getPreferredRegion();
      setGetRegionState(updateApiState.success(result));
      return result;
    } catch (error) {
      const errorMessage = createApiErrorMessage('선호 지역 조회', error);
      setGetRegionState(updateApiState.error(errorMessage));
      throw error;
    }
  }, []);

  const setPreferredCategories = useCallback(async (data: any) => {
    setSetCategoriesState(prev => updateApiState.start(prev));
    try {
      const result = await preferenceApi.setPreferredCategories(data);
      setSetCategoriesState(updateApiState.success(result));
      return result;
    } catch (error) {
      const errorMessage = createApiErrorMessage('선호 카테고리 설정', error);
      setSetCategoriesState(updateApiState.error(errorMessage));
      throw error;
    }
  }, []);

  const getPreferredCategories = useCallback(async () => {
    setGetCategoriesState(prev => updateApiState.start(prev));
    try {
      const result = await preferenceApi.getPreferredCategories();
      setGetCategoriesState(updateApiState.success(result));
      return result;
    } catch (error) {
      const errorMessage = createApiErrorMessage('선호 카테고리 조회', error);
      setGetCategoriesState(updateApiState.error(errorMessage));
      throw error;
    }
  }, []);

  return {
    setPreferredRegion,
    setRegionState,
    getPreferredRegion,
    getRegionState,
    setPreferredCategories,
    setCategoriesState,
    getPreferredCategories,
    getCategoriesState,
  };
};

// 가맹점 API Hook
export const useStoreApi = () => {
  const [popularStoresState, setPopularStoresState] = useState<ApiState<any[]>>(createInitialApiState());
  const [nearbyStoresState, setNearbyStoresState] = useState<ApiState<any[]>>(createInitialApiState());
  const [storeDetailsState, setStoreDetailsState] = useState<ApiState<any>>(createInitialApiState());

  const getPopularStores = useCallback(async (params: any) => {
    setPopularStoresState(prev => updateApiState.start(prev));
    try {
      const result = await storeApi.getPopularStores(params);
      setPopularStoresState(updateApiState.success(result));
      return result;
    } catch (error) {
      const errorMessage = createApiErrorMessage('인기 가맹점 조회', error);
      setPopularStoresState(updateApiState.error(errorMessage));
      throw error;
    }
  }, []);

  const getNearbyStores = useCallback(async (params: any) => {
    setNearbyStoresState(prev => updateApiState.start(prev));
    try {
      const result = await storeApi.getNearbyStores(params);
      setNearbyStoresState(updateApiState.success(result));
      return result;
    } catch (error) {
      const errorMessage = createApiErrorMessage('주변 가맹점 조회', error);
      setNearbyStoresState(updateApiState.error(errorMessage));
      throw error;
    }
  }, []);

  const getStoreDetails = useCallback(async (storeId: number) => {
    setStoreDetailsState(prev => updateApiState.start(prev));
    try {
      const result = await storeApi.getStoreDetails(storeId);
      setStoreDetailsState(updateApiState.success(result));
      return result;
    } catch (error) {
      const errorMessage = createApiErrorMessage('가맹점 상세 정보 조회', error);
      setStoreDetailsState(updateApiState.error(errorMessage));
      throw error;
    }
  }, []);

  return {
    getPopularStores,
    popularStoresState,
    getNearbyStores,
    nearbyStoresState,
    getStoreDetails,
    storeDetailsState,
  };
};

// 북마크 API Hook
export const useBookmarkApi = () => {
  const [createGroupState, setCreateGroupState] = useState<ApiState<any>>(createInitialApiState());
  const [getGroupsState, setGetGroupsState] = useState<ApiState<any>>(createInitialApiState());
  const [updateGroupState, setUpdateGroupState] = useState<ApiState<any>>(createInitialApiState());
  const [deleteGroupState, setDeleteGroupState] = useState<ApiState<any>>(createInitialApiState());
  const [getGroupState, setGetGroupState] = useState<ApiState<any>>(createInitialApiState());

  const createBookmarkGroup = useCallback(async (data: any) => {
    setCreateGroupState(prev => updateApiState.start(prev));
    try {
      const result = await bookmarkApi.createBookmarkGroup(data);
      setCreateGroupState(updateApiState.success(result));
      return result;
    } catch (error) {
      const errorMessage = createApiErrorMessage('북마크 그룹 생성', error);
      setCreateGroupState(updateApiState.error(errorMessage));
      throw error;
    }
  }, []);

  const getBookmarkGroups = useCallback(async () => {
    setGetGroupsState(prev => updateApiState.start(prev));
    try {
      const result = await bookmarkApi.getBookmarkGroups();
      setGetGroupsState(updateApiState.success(result));
      return result;
    } catch (error) {
      const errorMessage = createApiErrorMessage('북마크 그룹 조회', error);
      setGetGroupsState(updateApiState.error(errorMessage));
      throw error;
    }
  }, []);

  const updateBookmarkGroup = useCallback(async (groupId: number, data: any) => {
    setUpdateGroupState(prev => updateApiState.start(prev));
    try {
      const result = await bookmarkApi.updateBookmarkGroup(groupId, data);
      setUpdateGroupState(updateApiState.success(result));
      return result;
    } catch (error) {
      const errorMessage = createApiErrorMessage('북마크 그룹 수정', error);
      setUpdateGroupState(updateApiState.error(errorMessage));
      throw error;
    }
  }, []);

  const deleteBookmarkGroup = useCallback(async (data: any) => {
    setDeleteGroupState(prev => updateApiState.start(prev));
    try {
      const result = await bookmarkApi.deleteBookmarkGroup(data);
      setDeleteGroupState(updateApiState.success(result));
      return result;
    } catch (error) {
      const errorMessage = createApiErrorMessage('북마크 그룹 삭제', error);
      setDeleteGroupState(updateApiState.error(errorMessage));
      throw error;
    }
  }, []);

  const getBookmarkGroup = useCallback(async (groupId: number) => {
    setGetGroupState(prev => updateApiState.start(prev));
    try {
      const result = await bookmarkApi.getBookmarkGroup(groupId);
      setGetGroupState(updateApiState.success(result));
      return result;
    } catch (error) {
      const errorMessage = createApiErrorMessage('특정 북마크 그룹 조회', error);
      setGetGroupState(updateApiState.error(errorMessage));
      throw error;
    }
  }, []);

  return {
    createBookmarkGroup,
    createGroupState,
    getBookmarkGroups,
    getGroupsState,
    updateBookmarkGroup,
    updateGroupState,
    deleteBookmarkGroup,
    deleteGroupState,
    getBookmarkGroup,
    getGroupState,
  };
};

// 리뷰 API Hook
export const useReviewApi = () => {
  const [myReviewsState, setMyReviewsState] = useState<ApiState<any>>(createInitialApiState());

  const getMyReviews = useCallback(async () => {
    setMyReviewsState(prev => updateApiState.start(prev));
    try {
      const result = await reviewApi.getMyReviews();
      setMyReviewsState(updateApiState.success(result));
      return result;
    } catch (error) {
      const errorMessage = createApiErrorMessage('내 리뷰 조회', error);
      setMyReviewsState(updateApiState.error(errorMessage));
      throw error;
    }
  }, []);

  return {
    getMyReviews,
    myReviewsState,
  };
};

// AI API Hook - 현재 사용하지 않음
/*
export const useAiApi = () => {
  const [echoState, setEchoState] = useState<ApiState<any>>(createInitialApiState());
  const [pingState, setPingState] = useState<ApiState<string>>(createInitialApiState());

  const echo = useCallback(async (data: any) => {
    setEchoState(prev => updateApiState.start(prev));
    try {
      const result = await aiApi.echo(data);
      setEchoState(updateApiState.success(result));
      return result;
    } catch (error) {
      const errorMessage = createApiErrorMessage('AI 응답', error);
      setEchoState(updateApiState.error(errorMessage));
      throw error;
    }
  }, []);

  const ping = useCallback(async () => {
    setPingState(prev => updateApiState.start(prev));
    try {
      const result = await aiApi.ping();
      setPingState(updateApiState.success(result));
      return result;
    } catch (error) {
      const errorMessage = createApiErrorMessage('AI 서버 연결', error);
      setPingState(updateApiState.error(errorMessage));
      throw error;
    }
  }, []);

  return {
    echo,
    echoState,
    ping,
    pingState,
  };
};
*/
