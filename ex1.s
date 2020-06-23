	.section	__TEXT,__text,regular,pure_instructions
	.macosx_version_min 10, 13
	.section	__TEXT,__literal8,8byte_literals
	.p2align	3               ## -- Begin function main
LCPI0_0:
	.quad	4617991057905706598     ## double 5.5999999999999996
LCPI0_1:
	.quad	4629278204471803904     ## double 30.5
	.section	__TEXT,__text,regular,pure_instructions
	.globl	_main
	.p2align	4, 0x90
_main:                                  ## @main
	.cfi_startproc
## %bb.0:
	subq	$72, %rsp
	.cfi_def_cfa_offset 80
	movsd	LCPI0_0(%rip), %xmm0    ## xmm0 = mem[0],zero
	movsd	LCPI0_1(%rip), %xmm1    ## xmm1 = mem[0],zero
	movl	$10, %eax
	imull	$6, %eax, %eax
	addl	$5, %eax
	movl	%eax, %eax
	movl	%eax, %ecx
	movq	%rcx, 64(%rsp)
	movq	64(%rsp), %rcx
	movl	$4, %eax
	movl	%eax, %edx
	subl	$2, %edx
	movl	%edx, %edx
	movl	%edx, %esi
	addq	%rsi, %rcx
	movq	%rcx, 56(%rsp)
	movq	56(%rsp), %rcx
	movl	$2, %edx
	movl	%edx, %edx
	movl	%edx, %esi
	subq	%rsi, %rcx
	movq	64(%rsp), %rsi
	movl	%eax, %eax
	movl	%eax, %edi
	addq	%rdi, %rsi
	cvttsd2si	%xmm1, %eax
	addl	$2, %eax
	movl	%eax, %eax
	movl	%eax, %edi
	subq	%rdi, %rsi
	imulq	%rsi, %rcx
	movq	%rcx, 48(%rsp)
	movq	48(%rsp), %rcx
                                        ## kill: def $ecx killed $ecx killed $rcx
	movl	%ecx, 44(%rsp)
	movl	$5, %eax
	cvtsi2ss	%eax, %xmm1
	movss	%xmm1, 40(%rsp)
	movss	40(%rsp), %xmm1         ## xmm1 = mem[0],zero,zero,zero
	cvtss2sd	%xmm1, %xmm1
	movl	$20, %ecx
	cvtsi2sd	%ecx, %xmm2
	mulsd	%xmm2, %xmm0
	addsd	%xmm0, %xmm1
	movsd	%xmm1, 32(%rsp)
	movsd	32(%rsp), %xmm0         ## xmm0 = mem[0],zero
	cvtsi2sd	%eax, %xmm1
	subsd	%xmm1, %xmm0
	movsd	%xmm0, 24(%rsp)
	movl	44(%rsp), %edi
	callq	_putchar
	cvttsd2si	24(%rsp), %edi
	movl	%eax, 20(%rsp)          ## 4-byte Spill
	callq	_putchar
	movl	$10, %edi
	movl	%eax, 16(%rsp)          ## 4-byte Spill
	callq	_putchar
	xorl	%ecx, %ecx
	movl	%eax, 12(%rsp)          ## 4-byte Spill
	movl	%ecx, %eax
	addq	$72, %rsp
	retq
	.cfi_endproc
                                        ## -- End function
.subsections_via_symbols
