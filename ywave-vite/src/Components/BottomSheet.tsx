import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

export interface BottomSheetProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
	/** 0~1 (화면 높이 비율), 낮을수록 더 닫힌 상태. 예: [0.3, 0.6, 0.9] */
	snapPoints?: number[];
	/** 열릴 때 선택될 스냅 포인트 인덱스 (기본: 0) */
	initialSnapIndex?: number;
	/** 바텀시트가 화면 하단으로부터 띄울 여백(px). 예) 하단 네비게이션 높이 */
	bottomOffsetPx?: number;
	/** 시트를 특정 컨테이너로 포털 마운트 (예: '#main-content') */
	containerSelector?: string;
	/** 배경 오버레이 표시 여부 (기본: true) */
	showOverlay?: boolean;
	/** 드래그로 완전히 내렸을 때 닫을지 여부 (기본: false – 닫히지 않음) */
	dismissible?: boolean;
	/** 열림 진행도(0~1)를 외부로 전달 */
	onProgressChange?: (ratio: number) => void;
	/** 시트 상단에 붙는 부가 요소(예: "이 지역에서 검색" 버튼) */
	topAccessory?: React.ReactNode;
}

const Overlay = styled.div.withConfig({
	shouldForwardProp: (prop) => prop !== 'visible' && prop !== 'bottomOffsetPx'
})<{ visible: boolean; bottomOffsetPx: number }>`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: ${(p) => p.bottomOffsetPx}px;
	background-color: rgba(0, 0, 0, 0.5);
	opacity: ${(p) => (p.visible ? 1 : 0)};
	visibility: ${(p) => (p.visible ? "visible" : "hidden")};
	transition: opacity 0.25s ease, visibility 0.25s ease;
	z-index: 1000;
`;

const Sheet = styled.div.withConfig({
	shouldForwardProp: (prop) => prop !== 'translateYPx' && prop !== 'isDragging' && prop !== 'bottomOffsetPx'
})<{ translateYPx: number; isDragging: boolean; bottomOffsetPx: number }>`
	position: absolute;
	left: 0;
	right: 0;
	bottom: ${(p) => p.bottomOffsetPx}px;
	background-color: #ffffff;
	border-radius: 16px 16px 0 0;
	box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
	transform: translateY(${(p) => p.translateYPx}px);
	transition: ${(p) => (p.isDragging ? "none" : "transform 0.25s ease, cubic-bezier(0.25, 0.46, 0.45, 0.94)")};
	z-index: 1500; 
	height: calc(100% - ${(p) => p.bottomOffsetPx}px);
	max-height: calc(100% - ${(p) => p.bottomOffsetPx}px);
	touch-action: none; /* PWA 제스처 충돌 방지 */
	overflow: visible; /* 상단 액세서리/모달 겹침 허용 */
`;

const Handle = styled.div`
	width: 40px;
	height: 4px;
	background-color: #d1d5db;
	border-radius: 2px;
	margin: 12px auto 20px;
	cursor: grab;
`;

const Content = styled.div`
	height: calc(100% - 28px);
	overflow-y: auto;
	padding: 0 16px 16px;
	scrollbar-width: none;
	-ms-overflow-style: none;
	-webkit-overflow-scrolling: touch;
	overscroll-behavior: contain;
	overscroll-behavior-y: contain;
	
	&::-webkit-scrollbar {
		display: none;
	}
`;

const TopAccessoryContainer = styled.div`
	position: absolute;
	top: 0;
	left: 50%;
	transform: translate(-50%, calc(-100% - 16px));
	z-index: 1600; /* 시트 위로 */
	pointer-events: auto;
`;

export default function BottomSheet({ isOpen, onClose, children, snapPoints = [0.3, 0.6, 0.9], initialSnapIndex = 0, bottomOffsetPx = 0, containerSelector, showOverlay = true, dismissible = false, onProgressChange, topAccessory }: BottomSheetProps): React.JSX.Element {
	const [currentSnapIndex, setCurrentSnapIndex] = useState<number>(initialSnapIndex);
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const [startY, setStartY] = useState<number>(0);
	const [translateY, setTranslateY] = useState<number>(typeof window !== "undefined" ? window.innerHeight : 0);
	const draggingRef = useRef<boolean>(false);
	const sheetRootRef = useRef<HTMLDivElement | null>(null);
	const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);
	
	// refs to store current values and avoid closure issues
	const translateYRef = useRef<number>(translateY);
	const currentSnapIndexRef = useRef<number>(currentSnapIndex);
	const dismissibleRef = useRef<boolean>(dismissible);
	const onCloseRef = useRef<() => void>(onClose);
	const sortedSnapPointsRef = useRef<number[]>([]);
	const bottomOffsetPxRef = useRef<number>(bottomOffsetPx);
	const onProgressChangeRef = useRef<typeof onProgressChange>(onProgressChange);

	// Update refs when props change
	useEffect(() => {
		translateYRef.current = translateY;
	}, [translateY]);
	
	useEffect(() => {
		currentSnapIndexRef.current = currentSnapIndex;
	}, [currentSnapIndex]);
	
	useEffect(() => {
		dismissibleRef.current = dismissible;
	}, [dismissible]);
	
	useEffect(() => {
		onCloseRef.current = onClose;
	}, [onClose]);
	
	useEffect(() => {
		bottomOffsetPxRef.current = bottomOffsetPx;
	}, [bottomOffsetPx]);

	useEffect(() => {
		onProgressChangeRef.current = onProgressChange;
	}, [onProgressChange]);

	const sortedSnapPoints = useMemo(() => {
		const clamped = snapPoints.map((s) => Math.max(0, Math.min(1, s)));
		return Array.from(new Set(clamped)).sort((a, b) => a - b);
	}, [snapPoints]);
	
	useEffect(() => {
		sortedSnapPointsRef.current = sortedSnapPoints;
	}, [sortedSnapPoints]);

	const getAvailableHeightPx = useCallback(() => {
		const container = (portalEl ?? (sheetRootRef.current?.parentElement as HTMLElement | null));
		const containerHeight = container?.clientHeight ?? (typeof window !== "undefined" ? window.innerHeight : 0);
		const availableHeight = Math.max(0, containerHeight - bottomOffsetPxRef.current);
		return availableHeight;
	}, [portalEl]);

	const getSnapPx = useCallback((ratio: number) => getAvailableHeightPx() * (1 - ratio), [getAvailableHeightPx]);

	const emitProgress = useCallback((currentYPx: number) => {
		const available = getAvailableHeightPx();
		const ratio = available === 0 ? 0 : 1 - currentYPx / available;
		if (onProgressChangeRef.current) {
			onProgressChangeRef.current(Math.max(0, Math.min(1, ratio)));
		}
	}, [getAvailableHeightPx]);

	// 열림/닫힘 변화에 따른 초기 위치 세팅
	useEffect(() => {
		if (containerSelector) {
			const el = document.querySelector(containerSelector) as HTMLElement | null;
			setPortalEl(el);
		}
		if (isOpen) {
			const idx = Math.max(0, Math.min(sortedSnapPoints.length - 1, initialSnapIndex));
			setCurrentSnapIndex(idx);
			const y = getSnapPx(sortedSnapPoints[idx]);
			setTranslateY(y);
			emitProgress(y);
		} else {
			const y = getAvailableHeightPx();
			setTranslateY(y);
			emitProgress(y);
		}
	}, [isOpen, sortedSnapPoints.join(","), initialSnapIndex, getSnapPx, getAvailableHeightPx, emitProgress]);

	// 리사이즈 시 위치 보정
	useEffect(() => {
		const onResize = () => {
			if (isOpen) {
				const y = getSnapPx(sortedSnapPoints[currentSnapIndex]);
				setTranslateY(y);
				emitProgress(y);
			}
		};
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, [isOpen, currentSnapIndex, sortedSnapPoints, getSnapPx, emitProgress]);

	const findNearestSnapIndex = useCallback((currentYPx: number) => {
		const available = getAvailableHeightPx();
		const currentRatio = available === 0 ? 0 : 1 - currentYPx / available;
		let nearest = 0;
		let minDiff = Math.abs(sortedSnapPointsRef.current[0] - currentRatio);
		for (let i = 1; i < sortedSnapPointsRef.current.length; i++) {
			const diff = Math.abs(sortedSnapPointsRef.current[i] - currentRatio);
			if (diff < minDiff) {
				minDiff = diff;
				nearest = i;
			}
		}
		return nearest;
	}, [getAvailableHeightPx]);

	const minYPx = useCallback(() => getSnapPx(sortedSnapPointsRef.current[sortedSnapPointsRef.current.length - 1]), [getSnapPx]);
	const maxYPx = useCallback(() => getAvailableHeightPx(), [getAvailableHeightPx]);

	// 터치 핸들러
	const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
		if (!isOpen) return;
		draggingRef.current = true;
		setIsDragging(true);
		setStartY(e.touches[0].clientY);
	};
	
	const onTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
		if (!draggingRef.current || !isOpen) return;
		const currentY = e.touches[0].clientY;
		const diffY = currentY - startY;
		const baseY = getSnapPx(sortedSnapPoints[currentSnapIndex]);
		const newY = baseY + diffY;
		const clampedY = Math.max(minYPx(), Math.min(maxYPx(), newY));
		setTranslateY(clampedY);
		emitProgress(clampedY);
	};
	
	const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = () => {
		if (!draggingRef.current || !isOpen) return;
		draggingRef.current = false;
		setIsDragging(false);
		if (dismissibleRef.current && translateYRef.current > getAvailableHeightPx() * 0.95) {
			onCloseRef.current();
			return;
		}
		const nearest = findNearestSnapIndex(translateYRef.current);
		setCurrentSnapIndex(nearest);
		const y = getSnapPx(sortedSnapPointsRef.current[nearest]);
		setTranslateY(y);
		emitProgress(y);
	};

	// 마우스(데스크탑) 핸들러
	const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
		if (!isOpen) return;
		draggingRef.current = true;
		setIsDragging(true);
		setStartY(e.clientY);
	};
	
	useEffect(() => {
		const onMouseMove = (e: MouseEvent) => {
			if (!draggingRef.current || !isOpen) return;
			const diffY = e.clientY - startY;
			const baseY = getSnapPx(sortedSnapPointsRef.current[currentSnapIndexRef.current]);
			const newY = baseY + diffY;
			const clampedY = Math.max(minYPx(), Math.min(maxYPx(), newY));
			setTranslateY(clampedY);
			emitProgress(clampedY);
		};
		
		const onMouseUp = () => {
			if (!draggingRef.current || !isOpen) return;
			draggingRef.current = false;
			setIsDragging(false);
			if (dismissibleRef.current && translateYRef.current > getAvailableHeightPx() * 0.95) {
				onCloseRef.current();
				return;
			}
			const nearest = findNearestSnapIndex(translateYRef.current);
			setCurrentSnapIndex(nearest);
			const y = getSnapPx(sortedSnapPointsRef.current[nearest]);
			setTranslateY(y);
			emitProgress(y);
		};
		
		if (isDragging) {
			document.addEventListener("mousemove", onMouseMove);
			document.addEventListener("mouseup", onMouseUp);
			return () => {
				document.removeEventListener("mousemove", onMouseMove);
				document.removeEventListener("mouseup", onMouseUp);
			};
		}
	}, [isDragging, isOpen, startY, getSnapPx, minYPx, maxYPx, findNearestSnapIndex, getAvailableHeightPx, emitProgress]);

	const content = (
		<>
			{showOverlay && (
				<Overlay visible={isOpen} onClick={onClose} bottomOffsetPx={bottomOffsetPx} />
			)}
			<Sheet
				translateYPx={translateY}
				isDragging={isDragging}
				ref={sheetRootRef}
				bottomOffsetPx={bottomOffsetPx}
			>
				{topAccessory && (
					<TopAccessoryContainer>{topAccessory}</TopAccessoryContainer>
				)}
				<Handle 
					onTouchStart={onTouchStart}
					onTouchMove={onTouchMove}
					onTouchEnd={onTouchEnd}
					onMouseDown={onMouseDown}
				/>
				<Content>{children}</Content>
			</Sheet>
		</>
	);

	return portalEl ? createPortal(content, portalEl) : content;
}