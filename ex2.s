	.section	__TEXT,__text,regular,pure_instructions
	.macosx_version_min 10, 13
	.section	__TEXT,__literal8,8byte_literals
	.p2align	3               ## -- Begin function main
LCPI0_0:
	.quad	4621819117588971520     ## double 10
LCPI0_1:
	.quad	4616752568008179712     ## double 4.5
LCPI0_2:
	.quad	4619004367821864960     ## double 6.5
LCPI0_3:
	.quad	4617315517961601024     ## double 5
	.section	__TEXT,__text,regular,pure_instructions
	.globl	_main
	.p2align	4, 0x90
_main:                                  ## @main
	.cfi_startproc
## %bb.0:
	subq	$40, %rsp
	.cfi_def_cfa_offset 48
	movsd	LCPI0_0(%rip), %xmm0    ## xmm0 = mem[0],zero
	movsd	LCPI0_1(%rip), %xmm1    ## xmm1 = mem[0],zero
	movsd	LCPI0_2(%rip), %xmm2    ## xmm2 = mem[0],zero
	movsd	LCPI0_3(%rip), %xmm3    ## xmm3 = mem[0],zero
	movsd	%xmm3, 32(%rsp)
	movsd	%xmm2, 24(%rsp)
	movsd	32(%rsp), %xmm2         ## xmm2 = mem[0],zero
	movsd	24(%rsp), %xmm3         ## xmm3 = mem[0],zero
	addsd	%xmm1, %xmm0
	mulsd	%xmm0, %xmm3
	addsd	%xmm3, %xmm2
	movsd	%xmm2, 16(%rsp)
	cvttsd2si	16(%rsp), %edi
	callq	_putchar
	xorl	%ecx, %ecx
	movl	%eax, 12(%rsp)          ## 4-byte Spill
	movl	%ecx, %eax
	addq	$40, %rsp
	retq
	.cfi_endproc
                                        ## -- End function
.subsections_via_symbols
